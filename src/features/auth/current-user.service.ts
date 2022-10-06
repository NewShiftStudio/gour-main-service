import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { decodeSomeDataCode } from './jwt.service';
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

  //FIXME: заменить этот метод на смену email
  async changePhone(userId: number, hashedCode: string, dto: ChangePhoneDto) {
    if (!hashedCode) throw new NotFoundException('Cookie не найден');

    const { code, someData } = decodeSomeDataCode(hashedCode || '');

    if (someData !== dto.phone)
      throw new BadRequestException('Неверный номер телефона');

    if (+code !== dto.code) throw new BadRequestException('Неверный код');

    return this.clientRepository.save({
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

    const isValidPrevPass = await bcrypt.compare(
      dto.prevPassword,
      prevPassHash,
    );

    if (!isValidPrevPass) throw new BadRequestException('Неверный пароль');

    const password = await bcrypt.hash(dto.newPassword, 5);

    return this.clientRepository.save({
      id: currentUserId,
      password,
    });
  }

  async changeCityId(currentUserId: number, cityId: number) {
    const city = await this.cityRepository.findOne(cityId);

    if (!city) throw new NotFoundException('Город не найден');

    return this.clientRepository.save({
      id: currentUserId,
      city: city.id,
    });
  }

  async changeMainProfileId(
    currentUserId: number,
    orderProfileId: number | null,
  ) {
    if (orderProfileId !== null) {
      const orderProfile = await this.orderProfileRepository.findOne(
        orderProfileId,
      );

      if (!orderProfile)
        throw new NotFoundException('Адрес доставки не найден');
    }

    return this.clientRepository.save({
      id: currentUserId,
      mainOrderProfileId: orderProfileId,
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

        if (!avatar) throw new NotFoundException('Аватар не найден');

        updatedObj.avatar = avatar;
      }
    }

    if (dto.mainOrderProfileId) {
      const orderProfile = await this.orderProfileRepository.findOne(
        dto.mainOrderProfileId,
      );
      if (!orderProfile) {
        throw new NotFoundException('Профиль заказа не найден');
      }
      updatedObj.mainOrderProfileId = orderProfile.id;
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
