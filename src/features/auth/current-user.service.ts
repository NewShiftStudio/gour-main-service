import { HttpException, Injectable } from '@nestjs/common';
import { decodePhoneCode } from './jwt.service';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class CurrentUserService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  getUser(id: number) {
    return this.clientRepository.findOne(id, {
      relations: ['role', 'city', 'referralCode', 'avatar'],
    });
  }

  async changePhone(
    currentUser: Client,
    hashedCode: string,
    dto: ChangePhoneDto,
  ) {
    if (!hashedCode) {
      throw new HttpException('Cookie code was not found', 400);
    }
    const { code, phone } = decodePhoneCode(hashedCode || '');

    if (phone !== dto.phone) {
      throw new HttpException('Wrong phone', 400);
    }

    if (+code !== dto.code) {
      throw new HttpException('Wrong code, please, try again', 400);
    }

    await this.clientRepository.save({
      id: currentUser.id,
      phone: dto.phone,
    });
  }

  async changePassword(currentUserId: number, dto: ChangePasswordDto) {
    const prevPassHash = (
      await this.clientRepository.findOne({
        id: currentUserId,
      })
    )?.password;

    if (!(await bcrypt.compare(dto.prevPassword, prevPassHash))) {
      throw new HttpException('Wrong password', 400);
    }

    return this.clientRepository.save({
      id: currentUserId,
      password: await bcrypt.hash(dto.newPassword, 5),
    });
  }
}
