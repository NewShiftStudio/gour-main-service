import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Order } from '../../entity/Order';
import { Client } from '../../entity/Client';
import { AmoCrmService } from './amo-crm.service';
import { OrderService } from './order.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ClientsService } from '../client/client.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly amoCrmService: AmoCrmService,
    private clientService: ClientsService,
  ) {}

  @MessagePattern('get-orders')
  async getAll(
    @Payload('client') client: Client,
    @Payload('params') params: BaseGetListDto,
  ) {
    const { orders, count } = await this.orderService.findClientOrders(
      params,
      client,
    );

    const crmInfoList = await this.amoCrmService.getCrmInfoList();
    // FIXME: Важно!!!
    // При изменении логики этого метода дублируйте изменения в метод getAllByUser

    const fullOrders = orders.map((order) => {
      const crmInfo = crmInfoList.find((it) => it.id === order.leadId);

      return {
        ...order,
        crmInfo,
      };
    });

    return [fullOrders, count];
  }

  @MessagePattern('get-orders-by-user')
  async getAllByUser(
    @Payload('clientId') clientId: Client['id'],
    @Payload('params') params: BaseGetListDto,
  ) {
    const client = await this.clientService.findOne(clientId);

    if (!client) throw new NotFoundException('Пользователь не найден');

    const { orders, count } = await this.orderService.findClientOrders(
      params,
      client,
    );

    const crmInfoList = await this.amoCrmService.getCrmInfoList();

    const fullOrders = orders.map((order) => {
      const crmInfo = crmInfoList.find((it) => it.id === order.leadId);

      return {
        ...order,
        crmInfo,
      };
    });

    return [fullOrders, count];
  }

  @MessagePattern('get-order')
  async getOne(@Payload() id: string) {
    const order = await this.orderService.getOne(id);

    const lead = await this.amoCrmService.getLead(order.leadId);

    const fullOrder = {
      ...order,
      crmInfo: lead,
    };

    return fullOrder;
  }

  @MessagePattern('create-order')
  async create(
    @Payload('client') client: Client,
    @Payload('dto') dto: OrderCreateDto,
  ) {
    return this.orderService.create(dto, client);
  }

  @MessagePattern('pay-order')
  async payOrder(@Payload() payload: PayOrderDto) {
    return this.orderService.payOrder(payload);
  }

  @MessagePattern('edit-order')
  put(@Payload('id') id: string, @Payload('dto') dto: Partial<Order>) {
    // TODO: если будут меняться товары, то изменить скидки
    return this.orderService.update(id, dto);
  }

  @MessagePattern('delete-order')
  remove(@Payload() id: string) {
    // TODO: если будут меняться товары, то удалить скидки
    return this.orderService.remove(id);
  }

  @MessagePattern('confirm-payment-by-token')
  changeOrderStatusByToken(@Payload() token: string) {
    return this.orderService.confirmPaymentByToken(token);
  }

  @MessagePattern('refresh-order-status')
  async refreshOrderStatus(@Payload() dto: UpdateOrderStatusDto) {
    const parsedDto: UpdateOrderStatusDto = JSON.parse(JSON.stringify(dto));
    const updateEvent = parsedDto.events[0];
    const splitedEventMeta = updateEvent.meta.href.split('/');
    const orderUuid = splitedEventMeta[splitedEventMeta.length - 1];

    return this.orderService.refreshOrderStatus(orderUuid);
  }

  @MessagePattern('update-order-status-by-token')
  async updateOrderStatusByToken(@Payload() token: string) {
    return this.orderService.updateOrderStatusByToken(token);
  }
}
