import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entity/Order';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { OrderCreateDto } from './dto/order.create.dto';
import { Client } from '../../entity/Client';
import { OrderProfile } from '../../entity/OrderProfile';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { OrderProduct } from '../../entity/OrderProduct';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(OrderProfile)
    private orderProfileRepository: Repository<OrderProfile>,
  ) {}

  findUsersOrders(params: BaseGetListDto, client: Client) {
    return this.orderRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: ['orderProducts', 'orderProfile', 'orderProfile.city'],
      where: {
        client,
      },
    });
  }

  findMany(params: BaseGetListDto) {
    return this.orderRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: ['orderProducts', 'orderProfile', 'orderProfile.city'],
    });
  }

  getOne(id: number) {
    return this.orderRepository.findOne(
      { id },
      {
        relations: ['orderProducts', 'orderProfile', 'orderProfile.city'],
      },
    );
  }

  async create(order: OrderCreateDto, client: Client) {
    const orderProfile = await this.orderProfileRepository.findOne(
      order.orderProfileId,
    );

    if (!orderProfile) {
      throw new HttpException('Order profile with this id was not found', 400);
    }

    const orderProducts = [];
    for (const orderProduct of order.orderProducts) {
      orderProducts.push(await this.orderProductRepository.save(orderProduct));
    }

    return this.orderRepository.save({
      status: OrderStatus.basketFilling,
      firstName: order.firstName,
      lastName: order.lastName,
      phone: order.phone,
      email: order.email,
      orderProducts,
      client,
      orderProfile,
      comment: order.comment,
    });
  }

  update(id: number, order: Partial<Order>) {
    return this.orderRepository.save({
      ...order,
      id,
    });
  }

  remove(id: number) {
    return this.orderRepository.softDelete(id);
  }
}
