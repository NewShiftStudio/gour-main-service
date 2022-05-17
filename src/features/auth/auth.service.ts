import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import { decodeToken, encodeJwt, verifyJwt } from './jwt.service';
import { Request } from 'express';
import { ReferralCode } from '../../entity/ReferralCode';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,
  ) {}

  async sendCode(phone: string): Promise<number> {
    const foundPhone = await this.clientRepository.findOne({
      phone,
    });

    if (foundPhone) {
      throw new HttpException('phone_exists_error', 400);
    }

    // TODO: Добавить сервис отправки сообщений
    return 1234;
  }

  async signup(dto: SignUpDto) {
    const sentCode = 1234;
    if (sentCode !== dto.code) {
      throw new HttpException('Bad code', 400);
    }

    const foundUser = await this.clientRepository.findOne({
      phone: dto.phone,
    });

    if (foundUser) {
      throw new HttpException('User with this phone already exists', 400);
    }

    let referralCode;

    if (dto.referralCode) {
      referralCode = await this.referralCodeRepository.findOne({
        code: dto.referralCode,
      });

      if (!referralCode) {
        throw new HttpException('Referral code is not found', 400);
      }
    }

    return this.clientRepository.save({
      roleId: dto.roleId,
      name: dto.name,
      phone: dto.phone,
      cityId: dto.cityId,
      referralCode: referralCode,
      password: await this.getPasswordHash(dto.password),
    });
  }

  async signin(dto: SignInDto): Promise<{
    token: string;
    client: Client;
  }> {
    const user = await this.clientRepository.findOne({
      phone: dto.phone,
    });

    if (
      user &&
      user.isApproved &&
      (await bcrypt.compare(dto.password, user.password))
    ) {
      return {
        token: encodeJwt(user),
        client: user,
      };
    }

    if (!user) {
      throw new HttpException('User is not found', 401);
    }

    if (!user.isApproved) {
      throw new HttpException('User is not approved', 401);
    }

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

    if (user && user.isApproved) {
      return {
        token: encodeJwt(user),
        client: user,
      };
    }

    if (!user) {
      throw new HttpException('User is not found', 401);
    }

    if (!user.isApproved) {
      throw new HttpException('User is not approved', 401);
    }
  }

  decodeToken(token: string) {
    if (!verifyJwt(token)) {
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
