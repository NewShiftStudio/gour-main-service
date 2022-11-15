import { Repository, Connection } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
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
import { Order } from '../../entity/Order';
import { OrderProduct } from '../../entity/OrderProduct';
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
import { Currency, WalletService } from '../wallet/wallet.service';
import { Wallet } from 'src/entity/Wallet';
import { WalletTransaction } from 'src/entity/WalletTransaction';
import { AmoCrmService } from './amo-crm.service';
import { cutUuidFromMoyskladHref } from '../warehouse/moysklad.helper';
import { OrderProfileService } from '../order-profile/order-profile.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { InvoiceDto } from '../wallet/dto/invoice.dto';
import { InvoiceCreateDto } from './dto/create-invoice.dto';
import { decodeToken, encodeJwt, verifyJwt } from '../auth/jwt.service';
import { PayOrderDto } from './dto/pay-order.dto';

const organizationId = process.env.WAREHOUSE_ORGANIZATION_ID;

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject('PAYMENT_SERVICE') private client: ClientProxy,

    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private orderProfileService: OrderProfileService,
    private productService: ProductService,
    private clientService: ClientsService,
    private warehouseService: WarehouseService,
    private discountService: DiscountService,
    private walletService: WalletService,
    private amoCrmService: AmoCrmService,
    private connection: Connection,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

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

  async getOne(id: string): Promise<OrderWithTotalSumDto> {
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

  async getOneByWarehouseUuid(uuid: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ warehouseId: uuid });

    if (!order) throw new NotFoundException('Заказ по uuid склада не найден');

    return order;
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
      const orderProfile = await this.orderProfileService.getOne(
        order.deliveryProfileId,
      );

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

      //TODO: вернуть когда вернем оплату заказа чизкойнами (рублями)
      // const wallet = await this.walletService.getByClientId(client.id);

      // await this.walletService.useCoins(
      //   wallet.uuid,
      //   orderWithTotalSum.totalSum,
      //   `Оплата заказа №${newOrder.id}`,
      //   walletRepository,
      //   transactionRepository,
      // );

      const assortment: ModificationDto[] = orderWithTotalSum.orderProducts.map(
        (p) => ({
          discount: 0,
          price: p.totalSumWithoutAmount * 100, // цена в копейках
          quantity: p.amount,
          type: 'variant',
          productId: p.product?.moyskladId,
          gram: p.gram,
        }),
      );

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

      const warehouseOrder = await this.warehouseService.createOrder(
        assortment,
        {
          organizationId,
          firstName: newOrder.firstName,
          lastName: newOrder.lastName,
          city: newOrder.orderProfile.city.name.ru,
          street: newOrder.orderProfile.street,
          house: newOrder.orderProfile.house,
          apartment: newOrder.orderProfile.apartment,
          comment: newOrder.orderProfile.comment,
          addInfo: newOrder.comment,
          postalCode: '000000', //FIXME: добавить в профиль создание постал кода
          counterpartyId: warehouseClientId,
        },
      );

      if (!warehouseOrder)
        throw new BadRequestException(
          'Ошибка при создании заказа в сервисе склада',
        );

      const description = this.getDescription(orderWithTotalSum);

      const stateUuid = cutUuidFromMoyskladHref(warehouseOrder.state.meta.href);
      const state = await this.warehouseService.getMoyskladState(stateUuid);
      const stateName = state.name;

      const leadName = `${newOrder.lastName} ${newOrder.firstName} ${newOrder.createdAt}`;

      const lead = await this.amoCrmService.createLead({
        name: leadName,
        description,
        price: orderWithTotalSum.totalSum,
        stateName,
      });

      await orderRepository.save({
        id: newOrder.id,
        leadId: +lead.id,
        warehouseId: warehouseOrder.id,
      });

      const invoice = {
        currency: Currency.RUB,
        value: orderWithTotalSum.totalSum,
        meta: {
          orderUuid: newOrder.id,
          crmOrderId: +lead.id,
        },
        payerUuid: client.id,
      };

      const newInvoice = await firstValueFrom(
        this.client.send<InvoiceDto, InvoiceCreateDto>(
          'create-invoice',
          invoice,
        ),
      );

      await orderRepository.save({
        id: newOrder.id,
        invoiceUuid: newInvoice.uuid,
      });

      await queryRunner.commitTransaction();

      return this.getOne(newOrder.id);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async payOrder(dto: PayOrderDto) {
    const client = await this.clientService.findOne(dto.payerUuid);
    if (!client) throw new NotFoundException('Пользователь не найден');

    try {
      const invoice = await firstValueFrom(
        this.client.send<InvoiceDto>('get-invoice', {
          uuid: dto.invoiceUuid,
        }),
      );

      if (!invoice) {
        throw new NotFoundException('Счет не найден');
      }

      const order = await this.getOne(invoice.meta.orderUuid);

      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }

      const paymentData = {
        currency: dto.currency,
        email: dto.email,
        invoiceUuid: dto.invoiceUuid,
        payerUuid: client.id,
        ipAddress: dto.ipAddress,
        signature: dto.signature,
        successUrl: `${
          process.env.CHANGE_ORDER_STATUS_URL
        }?authToken=${encodeJwt(
          { orderUuid: invoice.meta.orderUuid, crmOrderId: order.leadId },
          process.env.SIGNATURE_SECRET,
          '5m',
        )}`,
        rejectUrl: process.env.REJECT_REDIRECT_URL_BUY_COINS,
      };

      const data = await firstValueFrom(
        this.client.send<InvoiceDto, PayOrderDto>('pay', paymentData),
      );

      if (data.redirectUri) {
        return {
          redirect: data.redirectUri,
        };
      }

      return data;
    } catch (error) {
      throw new HttpException(
        `Ошибка при оплате: ${error?.message || ''}`,
        error?.status,
      );
    }
  }

  async changeOrderStatusByToken(token: string): Promise<{ redirect: string }> {
    const dto = decodeToken(token) as { orderUuid: string; crmOrderId: string };

    try {
      if (!verifyJwt(token, process.env.SIGNATURE_SECRET)) {
        throw new ForbiddenException('Токен не действителен');
      }

      console.info('ЗАКАЗ ОПЛАЧЕН !))))', dto.crmOrderId, dto.orderUuid);

      return {
        redirect: `${process.env.SUCCESS_REDIRECT_URL_PAY}&crmOrderId=${dto.crmOrderId}`,
      };
    } catch (error) {
      console.error(error);
      return {
        redirect: process.env.REJECT_REDIRECT_URL_PAY,
      };
    }
  }

  update(id: string, order: Partial<Order>) {
    return this.orderRepository.save({
      ...order,
      id,
    });
  }

  remove(id: string) {
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
          totalSumWithoutAmount: Math.ceil(
            (product.totalCost / 1000) * orderProduct.gram,
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

    const { firstName, lastName, phone, email } = order;

    let description = `
      Заказ от ${firstName} ${lastName}
      Тел: ${phone}
      Email: ${email}
    
      Состав заказа:
    `;

    order.orderProducts.forEach((op) => {
      description += `${op.product.title.ru} `;
      description += op.gram + 'гр';
      description += ` ${op.totalSum}₡`;
      description += '\n';
    });

    description += `ИТОГО: ${order.totalSum}₡`;

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
