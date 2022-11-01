import { Repository, QueryRunner, Connection } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Product } from '../../entity/Product';
import { DiscountService } from '../discount/discount.service';
import { Discount } from 'src/entity/Discount';
import { WarehouseService } from '../warehouse/warehouse.service';
import { ModificationDto } from '../warehouse/dto/modification.dto';
import { ClientsService } from '../client/client.service';
import { WalletService } from '../wallet/wallet.service';
import { Wallet } from 'src/entity/Wallet';
import { WalletTransaction } from 'src/entity/WalletTransaction';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(OrderProfile)
    private orderProfileRepository: Repository<OrderProfile>,

    private productService: ProductService,
    private clientService: ClientsService,
    private warehouseService: WarehouseService,
    private discountService: DiscountService,
    private walletService: WalletService,
    private connection: Connection,
  ) {}

  async findUsersOrders(params: BaseGetListDto, client: Client) {
    const [orders, count] = await this.orderRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: [
        'orderProducts',
        'orderProfile',
        'orderProfile.city',
        'client',
      ],
      where: {
        client,
      },
    });

    const ordersWithTotalSum: OrderWithTotalSumDto[] = [];

    for (const order of orders) {
      const orderWithTotalSum = await this.prepareOrder(order);

      if (orderWithTotalSum) ordersWithTotalSum.push(orderWithTotalSum);
    }

    return { orders: ordersWithTotalSum, count };
  }

  async findMany(params: BaseGetListDto) {
    const [orders, count] = await this.orderRepository.findAndCount({
      ...getPaginationOptions(params.offset, params.length),
      relations: ['orderProducts', 'orderProfile', 'orderProfile.city'],
    });

    const ordersWithTotalSum: OrderWithTotalSumDto[] = [];

    for (const order of orders) {
      const orderWithTotalSum = await this.prepareOrder(order);

      ordersWithTotalSum.push(orderWithTotalSum);
    }

    return { orders: ordersWithTotalSum, count };
  }

  async getOne(id: number): Promise<OrderWithTotalSumDto> {
    const order = await this.orderRepository.findOne(
      { id },
      {
        relations: [
          'orderProducts',
          'orderProfile',
          'orderProfile.city',
          'client',
        ],
      },
    );

    if (!order) throw new NotFoundException('Заказ не найден');

    const orderWithTotalSum = await this.prepareOrder(order);

    return orderWithTotalSum;
  }

  async create(order: OrderCreateDto, client: Client) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    const discountRepository = queryRunner.manager.getRepository(Discount);
    const orderRepository = queryRunner.manager.getRepository(Order);
    const walletRepository = queryRunner.manager.getRepository(Wallet);
    const transactionRepository =
      queryRunner.manager.getRepository(WalletTransaction);

    try {
      const orderProfile = await this.orderProfileRepository.findOne(
        order.orderProfileId,
      );

      if (!orderProfile)
        throw new NotFoundException('Профиль заказа не найден');

      const orderProducts: OrderProduct[] = [];

      for (const orderProductDto of order.orderProducts) {
        const { productId, amount, gram } = orderProductDto;

        const product = await this.productRepository.findOne(productId, {
          relations: ['categories'],
        });

        if (!product) throw new NotFoundException('Товар не найден');

        const discountPromises = product.categories.map(async (category) => {
          const candidateDiscount = await this.discountService.findOneByFK(
            client,
            category,
          );

          const price = Math.ceil(
            (product.price.cheeseCoin / 1000) * gram * amount,
          );

          if (candidateDiscount) {
            return discountRepository.save({
              ...candidateDiscount,
              price: candidateDiscount.price + price,
            });
          }

          return discountRepository.save({
            client,
            productCategory: category,
            price,
          });
        });

        await Promise.all(discountPromises);

        const orderProduct = await this.orderProductRepository.save({
          product,
          amount,
          gram,
        });

        orderProducts.push(orderProduct);
      }

      const newOrder = await orderRepository.save({
        status: OrderStatus.basketFilling,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        email: order.email,
        orderProducts,
        client,
        orderProfile,
        comment: order.comment || '',
      });

      const orderWithTotalSum = await this.prepareOrder(newOrder);

      const wallet = await this.walletService.getByClientId(client.id);
      await this.walletService.useCoins(
        wallet.uuid,
        orderWithTotalSum.totalSum,
        'Оплата заказа',
        walletRepository,
        transactionRepository,
      );

      const assortment: ModificationDto[] = orderProducts.map((o) => ({
        discount: 0,
        price: Math.ceil(
          (o.product.price.cheeseCoin / 1000) * o.gram * o.amount,
        ),
        quantity: o.amount,
        type: 'variant',
        productId: o.product?.moyskladId,
        gram: o.gram,
      }));

      const fullClient = await this.clientService.findOne(client.id);

      let warehouseClientId = fullClient.warehouseClientId;

      // Создание контрагента, требование моего склада
      if (!warehouseClientId) {
        const agent = await this.warehouseService.createWarehouseAgent({
          description: 'Клиент из интернет-магазина tastyoleg.com',
          email: fullClient.email,
          name: `${fullClient.firstName}  ${fullClient.lastName}`,
          phone: fullClient.phone,
        });

        warehouseClientId = agent.id;

        await this.clientService.updateWarehouseClientId(
          client.id,
          warehouseClientId,
        );
      }

      // const warehouseOrder = await this.warehouseService.createOrder(
      //   assortment,
      //   {
      //     organizationId: process.env.WAREHOUSE_ORGANIZATION_ID,
      //     firstName: newOrder.firstName,
      //     lastName: newOrder.lastName,
      //     city: newOrder.orderProfile.city.name.ru,
      //     street: newOrder.orderProfile.street,
      //     house: newOrder.orderProfile.house,
      //     apartment: newOrder.orderProfile.apartment,
      //     comment: newOrder.orderProfile.comment,
      //     addInfo: newOrder.comment,
      //     postalCode: '000000', //FIXME: добавить в профиль создание постал кода
      //     counterpartyId: warehouseClientId,
      //   },
      // );

      // if (!warehouseOrder) {
      //   throw new BadRequestException(
      //     'Ошибка при создании заказа в сервисе склада',
      //   );
      // }

      // console.info('Warehouse order: ', warehouseOrder);

      await queryRunner.commitTransaction();
      return newOrder;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
      if (!orderProduct.product) return;

      const product = await this.productService.prepareProduct(
        order.client,
        orderProduct.product,
      );

      if (product)
        fullOrderProducts.push({
          ...orderProduct,
          product,
          totalSum: Math.ceil(
            (product.totalCost / 1000) *
              orderProduct.gram *
              orderProduct.amount,
          ),
        });
    }

    const totalSum = Math.ceil(
      fullOrderProducts.reduce((acc, item) => acc + item.totalSum, 0),
    );

    const promotions: OrderPromotion[] = [];

    for (const orderProduct of fullOrderProducts) {
      if (!orderProduct.product.promotions) return;

      for (const promotion of orderProduct.product.promotions) {
        let value =
          (promotion.discount / 100) * orderProduct.product.price.cheeseCoin;

        value = value * orderProduct.gram;

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
      throw new Error('Необходимы товары из заказа');

    if (!order.orderProfile) throw new Error('Необходим профиль заказа');

    let description = `
      Заказ от ${order.firstName} ${order.lastName}
      Тел: ${order.phone}
      Email: ${order.email}
    
      Состав заказа:
    `;

    order.orderProducts.forEach((op) => {
      description += `${op.product.title.ru} `;
      description += op.gram + 'гр';
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

    return description;
  }
}
