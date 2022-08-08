import { Repository } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  OrderProductWithTotalSumDto,
  OrderPromotion,
  OrderWithTotalSumDto,
} from './dto/order-with-total-sum.dto';
import { Client } from '../../entity/Client';
import { Order, OrderStatus } from '../../entity/Order';
import { OrderProduct } from '../../entity/OrderProduct';
import { OrderProfile } from '../../entity/OrderProfile';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { OrderCreateDto } from './dto/order-create.dto';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ProductService } from '../product/product.service';

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
    private productService: ProductService,
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

  async findMany(params: BaseGetListDto) {
    const [orders, count] = await this.orderRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: [
        'client',
        'orderProducts',
        'orderProfile',
        'orderProfile.city',
      ],
    });

    const ordersWithTotalSum: OrderWithTotalSumDto[] = [];

    for (const order of orders) {
      const orderWithTotalSum = await this.prepareOrder(order);

      ordersWithTotalSum.push(orderWithTotalSum);
    }

    return [ordersWithTotalSum, count];
  }

  async getOne(id: number): Promise<OrderWithTotalSumDto> {
    const order = await this.orderRepository.findOne(
      { id },
      {
        relations: [
          'client',
          'orderProducts',
          'orderProfile',
          'orderProfile.city',
        ],
      },
    );

    if (!order)
      throw new HttpException('Order with this id was not found', 404);

    const orderWithTotalSum = await this.prepareOrder(order);

    return orderWithTotalSum;
  }

  async create(order: OrderCreateDto, client: Client) {
    const orderProfile = await this.orderProfileRepository.findOne(
      order.orderProfileId,
    );

    if (!orderProfile)
      throw new HttpException('Order profile with this id was not found', 400);

    const orderProducts: OrderProduct[] = [];

    for (const orderProductDto of order.orderProducts) {
      const orderProduct = await this.orderProductRepository.save(
        orderProductDto,
      );

      orderProducts.push(orderProduct);
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

  async prepareOrder(order: Order): Promise<OrderWithTotalSumDto> {
    const fullOrderProducts: OrderProductWithTotalSumDto[] = [];

    for (const orderProduct of order.orderProducts) {
      const product = await this.productService.prepareProduct(
        order.client,
        orderProduct.product,
      );

      fullOrderProducts.push({
        ...orderProduct,
        product,
        totalSum: product.isWeightGood
          ? product.totalCost * orderProduct.weight
          : product.totalCost * orderProduct.amount,
      });
    }

    const totalSum = fullOrderProducts.reduce(
      (acc, item) => acc + item.totalSum,
      0,
    );

    const promotions: OrderPromotion[] = [];

    for (const orderProduct of fullOrderProducts) {
      for (const promotion of orderProduct.product.promotions) {
        let value =
          (promotion.discount / 100) * orderProduct.product.price.cheeseCoin;

        if (orderProduct.product.isWeightGood)
          value = value * orderProduct.weight;
        else value = value * orderProduct.amount;

        const index = promotions.findIndex(
          (it) => it.title === promotion.title.ru,
        );

        if (index === -1)
          promotions.push({
            title: promotion.title.ru,
            value,
          });
        else promotions[index].value += value;
      }
    }

    const fullOrder = {
      ...order,
      orderProducts: fullOrderProducts,
      totalSum,
      promotions,
    };

    return fullOrder;
  }

  getDescription(order: OrderWithTotalSumDto): string {
    if (!order.orderProducts?.length)
      throw new Error('order.orderProducts is required');

    if (!order.orderProfile) throw new Error('order.orderProfile is required');

    let description = `
      Заказ от ${order.firstName} ${order.lastName}
      Тел: ${order.phone}
      Email: ${order.email}
    
      Состав заказа:
    `;

    order.orderProducts.forEach((op) => {
      description += `${op.product.title.ru} `;
      description += op.product.isWeightGood
        ? op.weight + 'гр'
        : op.amount + 'шт';
      description += ` ${op.totalSum}₡`;
      description += '\n';
    });

    const totalOrderSum = order.orderProducts.reduce(
      (acc, item) => acc + item.totalSum,
      0,
    );

    description += `ИТОГО: ${totalOrderSum}₡`;

    if (order.comment) description += 'Комментарий: ' + order.comment;

    /* eslint-disable prettier/prettier */
    description += `
      Адрес: ${order.orderProfile.city.name.ru}, ул.${
      order.orderProfile.street
    }, д.${order.orderProfile.house},
      Подъезд ${order.orderProfile.entrance}, этаж ${
      order.orderProfile.floor
    }, кв ${order.orderProfile.apartment}
      ${
        order.orderProfile.comment
          ? `Комментарий: ${order.orderProfile.comment}`
          : ''
      }
    `;

    // TODO: добавить рассчет стоимости
    return description;
  }
}
