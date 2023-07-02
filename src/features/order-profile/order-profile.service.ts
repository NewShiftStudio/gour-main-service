import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/browser';

import { OrderProfile } from '../../entity/OrderProfile';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { Client } from '../../entity/Client';
import { City } from '../../entity/City';
import { OrderProfileUpdateDto } from './dto/order-profile.update.dto';

@Injectable()
export class OrderProfileService {
  constructor(
    @InjectRepository(OrderProfile)
    private orderProfileRepository: Repository<OrderProfile>,

    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  findMany(client: Client, params: BaseGetListDto) {
    return this.orderProfileRepository.find({
      ...getPaginationOptions(params.offset, params.length),
      where: {
        client,
      },
      relations: ['city'],
    });
  }

  async getOne(id: number) {
    const orderProfile = await this.orderProfileRepository.findOne({ id });

    if (!orderProfile) throw new NotFoundException('Профиль заказа не найден');

    return orderProfile;
  }

  async create(orderProfileDto: OrderProfileCreateDto, client?: Client) {
    const city = await this.cityRepository.findOne(orderProfileDto.cityId);

    if (!city) throw new NotFoundException('Город не найден');

    return this.orderProfileRepository.save({
      title:
        orderProfileDto.title ||
        orderProfileDto.street + ' ' + orderProfileDto.house,
      street: orderProfileDto.street,
      house: orderProfileDto.house,
      apartment: orderProfileDto.apartment,
      entrance: orderProfileDto.entrance,
      floor: orderProfileDto.floor,
      city,
      client,
    });
  }

  async update(id: number, dto: OrderProfileUpdateDto) {
    const updatedObj: DeepPartial<OrderProfile> = {
      title: dto.title,
      street: dto.street,
      house: dto.house,
      apartment: dto.apartment,
      entrance: dto.entrance,
      floor: dto.floor,
      comment: dto.comment,
      id,
    };

    if (dto.cityId) {
      const city = await this.cityRepository.findOne(dto.cityId);

      if (!city) throw new NotFoundException('Город не найден');

      updatedObj.city = city;
    }

    return this.orderProfileRepository.save(updatedObj);
  }

  remove(id: number) {
    return this.orderProfileRepository.delete(id);
  }
}
