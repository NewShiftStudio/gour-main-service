import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entity/Client';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import {
  decodeToken,
  encodeJwt,
  encodeRefreshJwt,
  verifyJwt,
} from './jwt.service';
import { Request } from 'express';
import { ReferralCode } from '../../entity/ReferralCode';
import { generateSmsCode } from 'src/utils/generateSmsCode';
import { ClientRole } from 'src/entity/ClientRole';
import { City } from 'src/entity/City';

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
  ) {}

  async sendCode(phone: string): Promise<number> {
    const foundPhone = await this.clientRepository.findOne({
      phone,
    });

    if (foundPhone) {
      throw new HttpException('phone_exists_error', 400);
    }

    const code = generateSmsCode();
    // await this.smsSenderService.sendCode(phone, code);
    return code;
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

    let referralCode: ReferralCode;

    if (dto.referralCode) {
      referralCode = await this.referralCodeRepository.findOne({
        code: dto.referralCode,
      });

      if (!referralCode) {
        throw new HttpException('Referral code is not found', 400);
      }
    }

    const role = await this.clientRoleRepository.findOne(dto.roleId);

    if (!role)
      throw new HttpException('Client role with this id is not found', 400);

    const city = await this.cityRepository.findOne(dto.cityId);

    if (!city) throw new HttpException('City with this id is not found', 400);

    const password = await this.getPasswordHash(dto.password);

    return this.clientRepository.save({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role,
      city,
      referralCode,
      password,
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
