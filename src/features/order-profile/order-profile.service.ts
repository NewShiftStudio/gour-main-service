import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProfile } from '../../entity/OrderProfile';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { Client } from '../../entity/Client';
import { City } from '../../entity/City';

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
      title: orderProfileDto.street + ' ' + orderProfileDto.house,
      firstName: orderProfileDto.firstName,
      lastName: orderProfileDto.lastName,
      phone: orderProfileDto.phone,
      email: orderProfileDto.email,
      deliveryType: orderProfileDto.deliveryType,
      street: orderProfileDto.street,
      house: orderProfileDto.house,
      apartment: orderProfileDto.apartment,
      entrance: orderProfileDto.entrance,
      floor: orderProfileDto.floor,
      city,
      client,
    });
  }

  update(id: number, orderProfile: Partial<OrderProfile>) {
    return this.orderProfileRepository.save({
      ...orderProfile,
      id,
    });
  }

  remove(id: number) {
    return this.orderProfileRepository.delete(id);
  }
}
