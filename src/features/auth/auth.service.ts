import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import {
  decodeSomeDataCode,
  decodeToken,
  encodeJwt,
  encodeRefreshJwt,
  encodeSomeDataCode,
  verifyJwt,
} from './jwt.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Client } from '../../entity/Client';
import { SignInDto } from './dto/sign-in.dto';
import { ReferralCode } from '../../entity/ReferralCode';
import { generateSmsCode } from 'src/utils/generateSmsCode';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ClientRole } from '../../entity/ClientRole';
import { City } from '../../entity/City';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,

    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,

    @InjectRepository(City)
    private cityRepository: Repository<City>,

    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,

    @Inject('MESSAGES_SERVICE') private client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async sendCode(email: string): Promise<string> {
    const code = generateSmsCode();

    try {
      await this.sendEmail(email, code);
    } catch (error) {
      throw new BadRequestException('Ошибка при отправке кода');
    }

    return encodeSomeDataCode(email, code);
  }

  checkCode(code: string, hash: string) {
    const decodedHash = decodeSomeDataCode(hash);
    return code === decodedHash?.code;
  }

  async sendSms(phone: string, code: number) {
    return firstValueFrom(
      this.client.send('send-sms', { phone, msg: code.toString() }),
    );
  }

  async sendEmail(email: string, code: number) {
    return firstValueFrom(
      this.client.send('send-email', {
        email,
        subject: `Код подтверждения Gour Food`,
        content: `Ваш код подтверждения: <b>${code}</b>`,
      }),
    );
  }

  async signup(dto: SignUpDto) {
    const isValid = this.checkCode(dto.code, dto.hashedCode);

    if (!isValid) throw new BadRequestException('Неверный код');

    const user = await this.clientRepository.findOne({
      email: dto.email,
    });

    if (user)
      throw new BadRequestException('Пользователь с таким Email существует');

    const role = await this.clientRoleRepository.findOne(dto.roleId);

    if (!role) throw new NotFoundException('Роль не найдена');

    const city = await this.cityRepository.findOne(dto.cityId);

    if (!city) throw new NotFoundException('Город не найден');

    let referralCode: ReferralCode;

    if (dto.referralCode) {
      referralCode = await this.referralCodeRepository.findOne({
        code: dto.referralCode,
      });
    }

    const password = await this.getPasswordHash(dto.password);

    return this.clientRepository.save({
      role: dto.roleId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      city: dto.cityId,
      referralCode,
      password,
    });
  }

  async recoverPassword(dto: RecoverPasswordDto) {
    const isValid = this.checkCode(dto.code, dto.hashedCode);

    if (!isValid) throw new BadRequestException('Неверный код');

    const user = await this.clientRepository.findOne({
      email: dto.email,
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    if (dto.password !== dto.passwordConfirm)
      throw new BadRequestException('Пароли не совпадают');

    const password = await this.getPasswordHash(dto.password);

    return this.clientRepository.save({
      id: user.id,
      email: dto.email,
      password,
    });
  }

  async signin(dto: SignInDto): Promise<{
    token: string;
    refreshToken: string;
    client: Client;
  }> {
    const user = await this.clientRepository.findOne({
      email: dto.email,
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) throw new UnauthorizedException('Неверный пароль');

    return {
      token: encodeJwt(user),
      refreshToken: encodeRefreshJwt(user),
      client: user,
    };
  }

  async signinById(id: number): Promise<{
    accessToken: string;
    refreshToken: string;
    client: Client;
  }> {
    const user = await this.clientRepository.findOne({
      id,
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    return {
      accessToken: encodeJwt(user),
      refreshToken: encodeRefreshJwt(user),
      client: user,
    };
  }

  decodeToken(token: string) {
    const isValidToken = verifyJwt(token, ACCESS_SECRET);

    if (!isValidToken) throw new ForbiddenException('Неверный токен');

    return decodeToken(token);
  }

  private getPasswordHash(password: string) {
    return bcrypt.hash(password, 5);
  }
}

export function getToken(req: Request): string | undefined {
  const header = req.header('Authorization');

  if (header) return header.replace('Bearer ', '');

  return req.cookies['AccessToken'];
}
