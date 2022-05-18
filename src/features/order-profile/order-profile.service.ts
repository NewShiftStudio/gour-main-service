import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProfile } from '../../entity/OrderProfile';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { Client } from '../../entity/Client';
import { City } from '../../entity/City';
import { DeepPartial } from 'typeorm/browser';
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

  getOne(id: number) {
    return this.orderProfileRepository.findOne({ id });
  }

  async create(orderProfileDto: OrderProfileCreateDto, client: Client) {
    const city = await this.cityRepository.findOne(orderProfileDto.cityId);
    if (!city) {
      throw new HttpException('City with this id was not found', 400);
    }

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
    const entity: DeepPartial<OrderProfile> = {
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
      if (!city) {
        throw new HttpException('City with this id was not found', 400);
      }

      entity.city = city;
    }

    return this.orderProfileRepository.save(entity);
  }

  remove(id: number) {
    return this.orderProfileRepository.delete(id);
  }
}
