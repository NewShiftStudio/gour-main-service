import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Order } from '../../entity/Order';
import { Client } from '../../entity/Client';
import { AmoCrmService } from './amo-crm.service';
import { OrderService } from './order.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderCreateDto } from './dto/order-create.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly amoCrmService: AmoCrmService,
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

    const leads = await this.amoCrmService.getLeadList();

    const fullOrders = orders.map((order) => {
      const lead = leads?.find((it) => it.id === order.leadId);

      return {
        ...order,
        crmInfo: lead,
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
  async post(
    @Payload('client') client: Client,
    @Payload('dto') dto: OrderCreateDto,
  ) {
    const { id } = await this.orderService.create(dto, client);

    const order = await this.orderService.getOne(id);

    const description = this.orderService.getDescription(order);

    const lead = await this.amoCrmService.createLead({
      name: `${order.lastName} ${order.firstName} ${order.createdAt}`,
      description,
      price: order.totalSum,
    });

    await this.orderService.update(id, {
      leadId: lead.id,
    });

    const fullOrder = {
      ...order,
      crmInfo: lead,
    };

    return fullOrder;
  }

  @MessagePattern('edit-order')
  put(@Payload('id') id: number, @Payload('dto') dto: Partial<Order>) {
    // FIXME: если будут меняться товары, то изменить скидки
    // Насколько это актуально?
    return this.orderService.update(id, dto);
  }

  @MessagePattern('delete-order')
  remove(@Payload() id: number) {
    // FIXME: если будут меняться товары, то удалить скидки
    return this.orderService.remove(id);
  }
}
