import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { decodeSomeDataCode } from './jwt.service';
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
import { ChangeEmailDto } from './dto/change-email.dto';

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

  async changeEmail(userId: number, hashedCode: string, dto: ChangeEmailDto) {
    if (!hashedCode) throw new NotFoundException('Cookie не найден');

    const user = await this.clientRepository.findOne({
      where: { email: dto.email },
    });

    if (user) throw new BadRequestException('Email занят');

    const { code, someData } = decodeSomeDataCode(hashedCode || '');

    if (code !== dto.code) throw new BadRequestException('Неверный код');

    if (someData !== dto.email) throw new BadRequestException('Неверный email');

    return this.clientRepository.save({
      id: userId,
      email: dto.email,
    });
  }

  async changePassword(currentUserId: number, dto: ChangePasswordDto) {
    const user = await this.clientRepository.findOne(currentUserId);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const prevPassHash = user.password;

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

  async changeAvatarId(currentUserId: number, avatarId: number) {
    const avatar = await this.imageRepository.findOne(avatarId);

    if (!avatar) throw new NotFoundException('Изображение не найдено');

    return this.clientRepository.save({
      id: currentUserId,
      avatar: avatar.id,
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
      id,
    };

    if (dto.phone) {
      const client = await this.clientRepository.findOne({
        where: { phone: dto.phone },
      });

      if (client) throw new NotFoundException('Номер телефона занят');

      updatedObj.phone = dto.phone;
    }

    if (dto.mainOrderProfileId) {
      const orderProfile = await this.orderProfileRepository.findOne(
        dto.mainOrderProfileId,
      );

      if (!orderProfile)
        throw new NotFoundException('Профиль заказа не найден');

      updatedObj.mainOrderProfileId = orderProfile.id;
    }

    if (dto.referralCode) {
      const referralCode = await this.referralCodeRepository.findOne({
        code: dto.referralCode,
      });

      if (referralCode) updatedObj.referralCode = referralCode;
    }

    return this.clientRepository.save(updatedObj);
  }
}
