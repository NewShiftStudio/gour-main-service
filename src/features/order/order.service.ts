import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entity/Order';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { OrderCreateDto } from './dto/order.create.dto';
import { Product } from '../../entity/Product';
import { Client } from '../../entity/Client';
import { OrderProduct } from '../../entity/OrderProduct';
import { OrderProfile } from '../../entity/OrderProfile';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(OrderProfile)
    private orderProfileRepository: Repository<OrderProfile>,
  ) {}

  findMany(params: BaseGetListDto) {
    return this.orderRepository.find({
      ...getPaginationOptions(params.offset, params.length),
    });
  }

  getOne(id: number) {
    return this.orderRepository.findOne({ id });
  }
  async create(order: OrderCreateDto) {
    const orderProducts = await this.productRepository.findByIds(
      order.orderProducts,
    );
    const client = await this.clientRepository.findOneOrFail({
      id: order.client,
    });
    const orderProfile = await this.orderProfileRepository.findOneOrFail({
      id: order.orderProfile,
    });
    return this.orderRepository.save({
      status: OrderStatus.init,
      orderProducts,
      client,
      orderProfile: orderProfile,
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
    return this.orderRepository.delete(id);
  }
}
