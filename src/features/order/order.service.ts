import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entity/Order';
import { getPaginationOptions } from '../../common/helpers/controllerHelpers';
import { OrderCreateDto } from './dto/order-create.dto';
import { Client } from '../../entity/Client';
import { OrderProfile } from '../../entity/OrderProfile';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderProduct } from '../../entity/OrderProduct';
import { getProductsWithFullCost } from '../product/product-cost-calculation.helper';
import { Promotion } from '../../entity/Promotion';
import { ProductService } from '../product/product.service';
import {
  OrderProductWithTotalSumDto,
  OrderWithTotalSumDto,
} from './dto/order.with-total-sum.dto';
import { ProductPromotion } from '../product/dto/product-with-full-cost.dto';

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

  findMany(params: BaseGetListDto) {
    return this.orderRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: ['orderProducts', 'orderProfile', 'orderProfile.city'],
    });
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

    const promotions: ProductPromotion[] = [];

    for (const orderProduct of fullOrderProducts) {
      for (const promotion of orderProduct.product.promotions) {
        let discount =
          (promotion.value / 100) * orderProduct.product.price.cheeseCoin;
        if (orderProduct.product.isWeightGood) {
          discount = discount * orderProduct.weight;
        } else {
          discount = discount * orderProduct.amount;
        }

        const index = promotions.findIndex((p) => p.title === promotion.title);
        if (index === -1) {
          promotions.push({
            title: promotion.title,
            value: discount,
          });
        } else {
          promotions[index].value += discount;
        }
      }
    }

    return {
      ...order,
      orderProducts: fullOrderProducts,
      totalSum,
      promotions,
    };
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
      console.log('orderProduct', orderProduct);
      orderProducts.push(await this.orderProductRepository.save(orderProduct));
    }

    console.log('orderProducts', orderProducts);

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

  getDescription(order: OrderWithTotalSumDto): string {
    if (!order.orderProducts?.length) {
      throw new Error('order.orderProducts is required');
    }
    if (!order.orderProfile) {
      throw new Error('order.orderProfile is required');
    }
    let description = `Заказ от ${order.firstName} ${order.lastName}
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
    if (order.comment) {
      description += 'Комментарий: ' + order.comment;
    }

    /* eslint-disable prettier/prettier */
    description += `
Адрес:
${order.orderProfile.city.name.ru}, ул.${order.orderProfile.street}, д.${order.orderProfile.house},
Подъезд ${order.orderProfile.entrance}, этаж ${order.orderProfile.floor}, кв ${order.orderProfile.apartment}
${order.orderProfile.comment ? `Комментарий: ${order.orderProfile.comment}` : ''}
    `

    // TODO: добавить рассчет стоимости
    return description;
  }
}
