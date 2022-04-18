import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import { decodeToken, encodeJwt, verifyJwt } from './jwt.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async sendCode(phone: string) {
    const foundPhone = await this.clientRepository.findOne({
      phone,
    });

    if (foundPhone) {
      throw new HttpException('phone_exists_error', 400);
    }

    //
  }

  async signup(dto: SignUpDto) {
    const sentCode = 1234;
    if (sentCode !== dto.code) {
      throw new HttpException('Bad code', 400);
    }

    return this.clientRepository.save({
      roleId: dto.roleId,
      name: dto.name,
      phone: dto.phone,
      cityId: dto.cityId,
      referralCode: dto.referralCode,
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
  return req.cookies('AccessToken');
}
