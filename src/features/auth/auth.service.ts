import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import {
  decodePhoneCode,
  decodeToken,
  encodeJwt,
  encodePhoneCode,
  encodeRefreshJwt,
  verifyJwt,
} from './jwt.service';
import { Request } from 'express';
import { ReferralCode } from '../../entity/ReferralCode';
import { generateSmsCode } from 'src/utils/generateSmsCode';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,
    @Inject('MESSAGES_SERVICE') private client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async sendCode(phone: string): Promise<string> {
    const foundPhone = await this.clientRepository.findOne({
      phone,
    });

    if (foundPhone) {
      throw new BadRequestException('Такой пользователь уже существует :[');
    }

    const code = generateSmsCode();

    try {
      const res = await this.sendSms(phone, code); //TODO: обрабатывать ошибку sms.ru
      console.log('res: ', res);
    } catch (error) {
      throw new BadRequestException('Ошибка при отправке кода');
    }

    return encodePhoneCode(phone, code);
  }

  checkCode(code: string, hash: string): boolean {
    const { code: validCode } = decodePhoneCode(hash);
    return code === validCode;
  }

  async sendSms(phone: string, code: number) {
    return firstValueFrom(
      this.client.send('send-sms', { phone, msg: code.toString() }),
    );
  }

  async signup(dto: SignUpDto) {
    const isValidCode = this.checkCode(dto.code, dto.codeHash);
    if (!isValidCode) {
      throw new ForbiddenException('Неверный код');
    }

    const foundUser = await this.clientRepository.findOne({
      phone: dto.phone,
    });

    if (foundUser) {
      throw new HttpException('Пользователь с таким телефоном существует', 400);
    }

    let referralCode: ReferralCode;

    if (dto.referralCode) {
      referralCode = await this.referralCodeRepository.findOne({
        code: dto.referralCode,
      });
    }

    return this.clientRepository.save({
      role: dto.roleId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      city: dto.cityId,
      referralCode: referralCode,
      password: await this.getPasswordHash(dto.password),
    });
  }

  async signin(dto: SignInDto): Promise<{
    token: string;
    refreshToken: string;
    client: Client;
  }> {
    const user = await this.clientRepository.findOne({
      phone: dto.phone,
    });

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return {
        token: encodeJwt(user),
        refreshToken: encodeRefreshJwt(user),
        client: user,
      };
    }

    if (!user) throw new HttpException('User is not found', 401);

    // if (!user.isApproved) {
    //   throw new HttpException('User is not approved', 401);
    // }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new HttpException('Bad password', 401);
    }
  }

  async signinById(id: number): Promise<{
    token: string;
    client: Client;
  }> {
    const user = await this.clientRepository.findOne({
      id,
    });

    if (user)
      return {
        token: encodeJwt(user),
        client: user,
      };
    else throw new HttpException('User is not found', 401);

    // if (!user.isApproved) {
    //   throw new HttpException('User is not approved', 401);
    // }
  }

  decodeToken(token: string) {
    if (!verifyJwt(token, ACCESS_SECRET)) {
      throw new HttpException('Bad token', 401);
    }

    return decodeToken(token);
  }

  private getPasswordHash(password: string) {
    return bcrypt.hash(password, 5);
  }
}

export function getToken(req: Request): string | undefined {
  const header = req.header('Authorization');
  if (header) {
    return header.replace('Bearer ', '');
  }

  return req.cookies['AccessToken'];
}
