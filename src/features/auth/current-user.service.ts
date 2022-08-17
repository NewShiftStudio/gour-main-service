import { HttpException, Injectable } from '@nestjs/common';
import { decodePhoneCode } from './jwt.service';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { UpdateUserDto } from './dto/update-user.dto';
import { Image } from '../../entity/Image';
import { OrderProfile } from '../../entity/OrderProfile';
import { City } from '../../entity/City';
import { ReferralCode } from 'src/entity/ReferralCode';

@Injectable()
export class CurrentUserService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(OrderProfile)
    private orderProfileRepository: Repository<OrderProfile>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(ReferralCode)
    private referralCodeRepository: Repository<ReferralCode>,
  ) {}

  getUser(id: number) {
    return this.clientRepository.findOne(id, {
      relations: ['role', 'city', 'referralCode', 'avatar'],
    });
  }

  async changePhone(userId: number, hashedCode: string, dto: ChangePhoneDto) {
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
      id: userId,
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

  async changeCityId(currentUserId: number, cityId: number) {
    const city = await this.cityRepository.findOne(cityId);

    if (!city) throw new HttpException('City with this id was not found ', 400);

    await this.clientRepository.save({
      id: currentUserId,
      city,
    });
  }

  async updateCurrentUser(id: number, dto: UpdateUserDto) {
    const updatedObj: DeepPartial<Client> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      id,
    };

    if ('avatarId' in dto) {
      if (dto.avatarId === null) updatedObj.avatar = null;
      else {
        const avatar = await this.imageRepository.findOne(dto.avatarId);

        if (!avatar)
          throw new HttpException('Avatar with this id was not found', 400);

        updatedObj.avatar = avatar;
      }
    }

    if (dto.mainOrderProfileId) {
      const orderProfile = await this.orderProfileRepository.findOne(
        dto.mainOrderProfileId,
      );
      if (!orderProfile) {
        throw new HttpException(
          'Order profile with this id was not found',
          400,
        );
      }
      updatedObj.mainOrderProfile = orderProfile;
    }

    if (dto.referralCode) {
      const referralCode = await this.referralCodeRepository.findOne({
        where: { code: dto.referralCode },
      });

      if (referralCode) updatedObj.referralCode = referralCode;
    }

    return this.clientRepository.save(updatedObj);
  }
}
