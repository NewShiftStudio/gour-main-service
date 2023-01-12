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
  OrderDiscount,
  OrderWithTotalSumDto,
} from './dto/order-with-total-sum.dto';
import { Client } from '../../entity/Client';
import { Order } from '../../entity/Order';
import { OrderProduct } from '../../entity/OrderProduct';
import { OrderCreateDto } from './dto/order-create.dto';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ProductService } from '../product/product.service';
import { Product } from '../../entity/Product';
import { DiscountService } from '../discount/discount.service';
import { Discount } from 'src/entity/Discount';
import { WarehouseService } from '../warehouse/warehouse.service';
import { ModificationDto } from '../warehouse/dto/modification.dto';
import { ClientService } from '../client/client.service';
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
import { ClientRole } from 'src/entity/ClientRole';
import { PromoCode } from 'src/entity/PromoCode';

const organizationId = process.env.WAREHOUSE_ORGANIZATION_ID;
const tokenSecret = process.env.SIGNATURE_SECRET;

const updateStatusUrl = process.env.UPDATE_ORDER_STATUS_BY_TOKEN_URL;
const confirmPaymentUrl = process.env.CONFIRM_PAYMENT_URL;
const successPaymentUrl = process.env.SUCCESS_REDIRECT_URL_PAY;
const rejectPaymentUrl = process.env.REJECT_REDIRECT_URL_PAY;

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

    @InjectRepository(ClientRole)
    private clientRoleRepository: Repository<ClientRole>,

    private orderProfileService: OrderProfileService,
    private productService: ProductService,
    private clientService: ClientService,
    private warehouseService: WarehouseService,
    private discountService: DiscountService,
    private walletService: WalletService,
    private amoCrmService: AmoCrmService,
    private connection: Connection,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async findClientOrders(params: BaseGetListDto, client: Client) {
    const skip = params.offset && +params.offset;
    const take = params.length && +params.length;

    const [orders, count] = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.promoCode', 'promoCode')
      .leftJoinAndSelect('order.orderProfile', 'orderProfile')
      .leftJoinAndSelect('orderProfile.city', 'orderCity')
      .leftJoinAndSelect('orderCity.name', 'orderCityName')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('product.title', 'productTitle')
      .leftJoinAndSelect('product.price', 'productPrice')
      .leftJoinAndSelect('product.images', 'productImages')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('categories.title', 'categoryTitle')
      .leftJoinAndSelect('categories.subCategories', 'categorySubCategories')
      .leftJoinAndSelect(
        'categories.parentCategories',
        'category.parentCategories',
      )
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .where('order.client.id = :clientId', { clientId: client.id })
      .getManyAndCount();

    const ordersWithTotalSum: OrderWithTotalSumDto[] = [];

    for (const order of orders) {
      const orderWithTotalSum = await this.prepareOrder(order);

      if (orderWithTotalSum) ordersWithTotalSum.push(orderWithTotalSum);
    }

    return { orders: ordersWithTotalSum, count };
  }

  // async findMany(params: BaseGetListDto) {
  //   const skip = params.offset && +params.offset;
  //   const take = params.length && +params.length;

  //   const [orders, count] = await this.orderRepository
  //     .createQueryBuilder('order')
  //     .leftJoinAndSelect('order.promoCode', 'promoCode')
  //     .leftJoinAndSelect('order.orderProfile', 'orderProfile')
  //     .leftJoinAndSelect('orderProfile.city', 'orderCity')
  //     .leftJoinAndSelect('orderCity.name', 'orderCityName')
  //     .leftJoinAndSelect('order.client', 'client')
  //     .leftJoinAndSelect('order.orderProducts', 'orderProducts')
  //     .leftJoinAndSelect('orderProducts.product', 'product')
  //     .leftJoinAndSelect('product.title', 'productTitle')
  //     .leftJoinAndSelect('product.price', 'productPrice')
  //     .leftJoinAndSelect('product.images', 'productImages')
  //     .leftJoinAndSelect('product.categories', 'categories')
  //     .leftJoinAndSelect('categories.title', 'categoryTitle')
  //     .leftJoinAndSelect('categories.subCategories', 'categorySubCategories')
  //     .leftJoinAndSelect(
  //       'categories.parentCategories',
  //       'category.parentCategories',
  //     )
  //     .orderBy('order.createdAt', 'DESC')
  //     .skip(skip)
  //     .take(take)
  //     .getManyAndCount();

  //   const ordersWithTotalSum: OrderWithTotalSumDto[] = [];

  //   for (const order of orders) {
  //     const orderWithTotalSum = await this.prepareOrder(order);

  //     ordersWithTotalSum.push(orderWithTotalSum);
  //   }

  //   return { orders: ordersWithTotalSum, count };
  // }

  async getOne(id: string): Promise<OrderWithTotalSumDto> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.promoCode', 'promoCode')
      .leftJoinAndSelect('order.orderProfile', 'orderProfile')
      .leftJoinAndSelect('orderProfile.city', 'orderCity')
      .leftJoinAndSelect('orderCity.name', 'orderCityName')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('product.title', 'productTitle')
      .leftJoinAndSelect('product.price', 'productPrice')
      .leftJoinAndSelect('product.images', 'productImages')
      .leftJoinAndSelect('product.categories', 'categories')
      .leftJoinAndSelect('categories.title', 'categoryTitle')
      .leftJoinAndSelect('categories.subCategories', 'categorySubCategories')
      .leftJoinAndSelect(
        'categories.parentCategories',
        'category.parentCategories',
      )
      .where('order.id = :id', { id })
      .getOne();

    if (!order) throw new NotFoundException('Заказ не найден');

    const orderWithTotalSum = await this.prepareOrder(order);

    return orderWithTotalSum;
  }

  async getOneByWarehouseUuid(uuid: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ warehouseId: uuid });

    if (!order) throw new NotFoundException('Заказ по uuid склада не найден');

    return order;
  }

  async create(dto: OrderCreateDto, client: Client) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    const discountRepository = queryRunner.manager.getRepository(Discount);
    const orderRepository = queryRunner.manager.getRepository(Order);
    const walletRepository = queryRunner.manager.getRepository(Wallet);
    const transactionRepository =
      queryRunner.manager.getRepository(WalletTransaction);
    const promoCodeRepository = queryRunner.manager.getRepository(PromoCode);

    try {
      const orderProfile = await this.orderProfileService.getOne(
        dto.deliveryProfileId,
      );

      const orderProducts: OrderProduct[] = [];

      for (const orderProductDto of dto.orderProducts) {
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

      const promoCode = await promoCodeRepository.findOne({
        id: dto.promoCodeId,
      });

      const order = await orderRepository.save({
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email,
        orderProducts,
        client,
        orderProfile,
        comment: dto.comment || '',
        orderDeliveryCost: orderProfile.city.deliveryCost,
      });

      const orderWithTotalSum = await this.prepareOrder(order, promoCode);

      //TODO: вернуть когда вернем оплату заказа чизкойнами (рублями)
      // const wallet = await this.walletService.getByClientId(client.id);

      // await this.walletService.useCoins(
      //   wallet.uuid,
      //   orderWithTotalSum.totalSum,
      //   `Оплата заказа №${order.id}`,
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
          firstName: order.firstName,
          lastName: order.lastName,
          city: order.orderProfile.city.name.ru,
          street: order.orderProfile.street,
          house: order.orderProfile.house,
          apartment: order.orderProfile.apartment,
          comment: order.orderProfile.comment,
          addInfo: order.comment,
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

      const leadName = `${order.lastName} ${order.firstName} ${order.createdAt}`;

      const lead = await this.amoCrmService.createLead({
        name: leadName,
        description,
        price: orderWithTotalSum.totalSum,
        stateName,
      });

      await orderRepository.save({
        id: order.id,
        leadId: +lead.id,
        warehouseId: warehouseOrder.id,
      });

      const invoice = {
        currency: Currency.RUB,
        value: orderWithTotalSum.totalSum,
        meta: {
          orderUuid: order.id,
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
        id: order.id,
        invoiceUuid: newInvoice.uuid,
        promoCode,
      });

      await queryRunner.commitTransaction();

      return this.getOne(order.id);
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

      const paymentToken = encodeJwt(
        {
          orderUuid: invoice.meta.orderUuid,
          crmOrderId: order.leadId,
          warehouseId: order.warehouseId,
        },
        tokenSecret,
        '5m',
      );

      const successPaymentUrl = `${confirmPaymentUrl}?authToken=${paymentToken}`;

      const paymentData = {
        currency: dto.currency,
        email: dto.email,
        invoiceUuid: dto.invoiceUuid,
        payerUuid: client.id,
        ipAddress: dto.ipAddress,
        signature: dto.signature,
        successUrl: successPaymentUrl,
        rejectUrl: rejectPaymentUrl,
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

  async confirmPaymentByToken(token: string): Promise<{ redirect: string }> {
    const dto = decodeToken(token) as {
      orderUuid: string;
      crmOrderId: string;
      warehouseId: string;
    };

    try {
      if (!verifyJwt(token, tokenSecret)) {
        throw new ForbiddenException('Токен не действителен');
      }

      const state = await this.warehouseService.getMoyskladStateByName(
        'Оплачен',
      );

      await this.warehouseService.updateMoyskladOrderState(
        dto.warehouseId,
        state,
      );

      return {
        redirect: `${successPaymentUrl}&crmOrderId=${dto.crmOrderId}`,
      };
    } catch (error) {
      console.error(error);
      return {
        redirect: rejectPaymentUrl,
      };
    }
  }

  async refreshOrderStatus(warehouseUuid: string) {
    const { leadId } = await this.getOneByWarehouseUuid(warehouseUuid);

    const updateToken = encodeJwt(
      {
        warehouseUuid,
        leadId,
      },
      tokenSecret,
      '5m',
    );

    const updateStatusUrlWithToken = `${updateStatusUrl}?updateToken=${updateToken}`;

    const updateStatusResponse = this.updateOrderStatusByToken(
      updateStatusUrlWithToken,
    );

    // return { redirect: updateStatusUrlWithToken };

    return updateStatusResponse;
  }

  async updateOrderStatusByToken(token: string) {
    const tokenIsValid = verifyJwt(token, tokenSecret);

    if (!tokenIsValid) throw new ForbiddenException('Токен не действителен');

    const dto = decodeToken(token) as {
      warehouseUuid: string;
      leadId: number;
    };

    const warehouseOrderStateUuid =
      await this.warehouseService.getMoyskladOrderStateUuid(dto.warehouseUuid);

    const state = await this.warehouseService.getMoyskladState(
      warehouseOrderStateUuid,
    );

    return this.amoCrmService.updateLeadStatus(dto.leadId, state.name);
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

  async prepareOrder(
    order: Order,
    promoCode?: PromoCode,
  ): Promise<OrderWithTotalSumDto> {
    const fullOrderProducts: OrderProductWithTotalSumDto[] = [];

    for (const orderProduct of order.orderProducts) {
      if (!orderProduct.product) return;

      const product = await this.productService.prepareProduct(
        order.client,
        orderProduct.product,
      );

      if (product) {
        const additionalGrams = 50;

        const discountByGram =
          (product.price.cheeseCoin * (product.discount / 100)) / 1000;
        const priceByGram = product.price.cheeseCoin / 1000;

        const totalDiscountWithoutAmount = discountByGram * (orderProduct.gram + additionalGrams);
        const totalDiscount = totalDiscountWithoutAmount * orderProduct.amount;

        const totalCostWithoutAmount = priceByGram * (orderProduct.gram + additionalGrams);
        const totalCost = totalCostWithoutAmount * orderProduct.amount;

        const totalSumWithoutAmount =
          totalCostWithoutAmount - totalDiscountWithoutAmount;
        const totalSum = totalSumWithoutAmount * orderProduct.amount;

        const fullOrderProduct = {
          ...orderProduct,
          product,
          totalDiscount,
          totalCost,
          totalSum,
          totalSumWithoutAmount,
        };

        fullOrderProducts.push(fullOrderProduct);
      }
    }

    const client = await this.clientService.findOne(order.client.id);

    const isIndividual = client.role.key === 'individual';

    const orderDiscounts: OrderDiscount[] = [];

    const referralCodeDiscount = client.referralCode?.discount;
    const promoCodeDiscount = promoCode?.discount;

    if (isIndividual) {
      const promotionsDiscountValue = Math.ceil(
        fullOrderProducts.reduce(
          (acc, fullOrderProduct) => acc + fullOrderProduct.totalDiscount,
          0,
        ),
      );

      if (promotionsDiscountValue) {
        const promotionsOrderDiscount: OrderDiscount = {
          title: 'Скидка за акции',
          value: promotionsDiscountValue,
        };

        orderDiscounts.push(promotionsOrderDiscount);
      }

      if (promoCodeDiscount) {
        const promoCodeDiscountValue = Math.ceil(
          fullOrderProducts.reduce(
            (acc, fullOrderProduct) =>
              acc + fullOrderProduct.totalSum * (promoCodeDiscount / 100),
            0,
          ),
        );

        const promoCodeOrderDiscount: OrderDiscount = {
          title: 'Скидка за промокод',
          value: promoCodeDiscountValue,
        };

        orderDiscounts.push(promoCodeOrderDiscount);
      }

      if (referralCodeDiscount && !promoCodeDiscount) {
        const referralCodeDiscountValue = Math.ceil(
          fullOrderProducts.reduce(
            (acc, fullOrderProduct) =>
              acc + fullOrderProduct.totalSum * (referralCodeDiscount / 100),
            0,
          ),
        );

        const referralCodeOrderDiscount: OrderDiscount = {
          title: 'Скидка за реферальный код',
          value: referralCodeDiscountValue,
        };

        orderDiscounts.push(referralCodeOrderDiscount);
      }
    }

    const totalSumWithoutDiscounts = fullOrderProducts.reduce(
      (acc, { totalCost }) => acc + totalCost,
      0,
    );

    let totalSum = Math.round(
      orderDiscounts.reduce(
        (acc, it) => acc - it.value,
        totalSumWithoutDiscounts,
      ),
    );
    const isNeedDelivery = totalSum > 2900;
    if (isNeedDelivery) {
      totalSum += order.orderDeliveryCost;
    }

    const fullOrder = {
      ...order,
      totalSum,
      orderProducts: fullOrderProducts,
      promotions: orderDiscounts,
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
