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

  getUser(id: string) {
    return this.clientRepository.findOne(id, {
      relations: ['role', 'city', 'referralCode', 'avatar'],
    });
  }

  async changeEmail(userId: string, hashedCode: string, dto: ChangeEmailDto) {
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

  async changePassword(currentUserId: string, dto: ChangePasswordDto) {
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

  async reduceGameLive(currentUserId: string) {
    const user = await this.clientRepository.findOne(currentUserId);

    if (!user) throw new NotFoundException('Пользователь не найден');
    if (user.lives <= 0)
      throw new BadRequestException('Некорректное количество жизней');

    return this.clientRepository.save({
      id: currentUserId,
      lives: user.lives - 1,
    });
  }

  async changeCityId(currentUserId: string, cityId: number) {
    const city = await this.cityRepository.findOne(cityId);

    if (!city) throw new NotFoundException('Город не найден');

    return this.clientRepository.save({
      id: currentUserId,
      city,
    });
  }

  async changeAvatarId(currentUserId: string, imageId?: number) {
    let avatar: number = null;

    if (imageId) {
      const image = await this.imageRepository.findOne(imageId);

      if (!image) throw new NotFoundException('Изображение не найдено');

      avatar = image.id;
    }

    return this.clientRepository.save({
      id: currentUserId,
      avatar,
    });
  }

  async changeMainProfileId(
    currentUserId: string,
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

  async updateCurrentUser(id: string, dto: UpdateUserDto) {
    const updatedObj: DeepPartial<Client> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      id,
    };

    if (dto.phone) {
      const client = await this.clientRepository.findOne({
        where: { phone: dto.phone },
      });

      if (client && client.id !== id)
        throw new NotFoundException('Номер телефона занят');

      if (!client) updatedObj.phone = dto.phone;
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
