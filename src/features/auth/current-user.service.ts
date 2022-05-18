import { HttpException, Injectable } from '@nestjs/common';
import { decodePhoneCode } from './jwt.service';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ClientUpdateDto } from '../client/dto/client.update.dto';
import { ClientRole } from '../../entity/ClientRole';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Product } from '../../entity/Product';
import { UpdateUserDto } from './dto/update-user.dto';
import { Image } from '../../entity/Image';
import { OrderProfile } from '../../entity/OrderProfile';

@Injectable()
export class CurrentUserService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(OrderProfile)
    private orderProfileRepository: Repository<OrderProfile>,
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

  async updateCurrentUser(id: number, dto: UpdateUserDto) {
    const updatedObj: DeepPartial<Client> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      id,
    };

    if (dto.avatarId) {
      const avatar = await this.imageRepository.findOne(dto.avatarId);
      if (!avatar) {
        throw new HttpException('Avatar with this id was not found', 400);
      }
      updatedObj.avatar = avatar;
    }

    if (dto.mainOrderProfileId) {
      const orderProfile = await this.orderProfileRepository.findOne(
        dto.mainOrderProfileId,
      );
      if (!orderProfile) {
        throw new HttpException('Order profile with this id was not found', 400);
      }
      updatedObj.mainOrderProfile = orderProfile;
    }

    return this.clientRepository.save(updatedObj);
  }
}
