import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Order } from '../../entity/Order';
import { Client } from '../../entity/Client';
import { AmoCrmService } from './amo-crm.service';
import { OrderService } from './order.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderCreateDto } from './dto/order-create.dto';
import { WarehouseService } from '../warehouse/warehouse.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly amoCrmService: AmoCrmService,
    private readonly warehouseService: WarehouseService,
  ) {}

  @MessagePattern('get-orders')
  async getAll(
    @Payload('client') client: Client,
    @Payload('params') params: BaseGetListDto,
  ) {
    const { orders, count } = await this.orderService.findUsersOrders(
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
  async getOne(@Payload() id: number) {
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

  @MessagePattern('edit-order')
  put(@Payload('id') id: number, @Payload('dto') dto: Partial<Order>) {
    // TODO: если будут меняться товары, то изменить скидки
    return this.orderService.update(id, dto);
  }

  @MessagePattern('delete-order')
  remove(@Payload() id: number) {
    // TODO: если будут меняться товары, то удалить скидки
    return this.orderService.remove(id);
  }

  @MessagePattern('refresh-order-status')
  async updateOrderStatus(@Payload() uuid: string) {
    const { leadId } = await this.orderService.getOneByWarehouseUuid(uuid);

    const warehouseOrderStateUuid =
      await this.warehouseService.getOrderStateUuid(uuid);

    const state = await this.warehouseService.getMoyskladState(
      warehouseOrderStateUuid,
    );

    return this.amoCrmService.updateStatus(leadId, state.name);
  }
}
