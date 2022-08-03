import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Order } from '../../entity/Order';
import { Client } from '../../entity/Client';
import { OrderResponseDto } from '../order/dto/order-response.dto';
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
    const leads = await this.amoCrmService.getLeadList();

    const leadsById = leads.reduce((acc, it) => {
      acc[it.id] = it;
      return acc;
    });

    const [orders, count] = await this.orderService.findUsersOrders(
      params,
      client,
    );

    const response: OrderResponseDto[] = orders.map((order) => ({
      order,
      crmInfo: leadsById[order.leadId],
      promotions: [
        {
          title: 'Скидка за наеденность',
          value: 100,
          currency: 'cheeseCoin',
        },
      ],
    }));

    return [response, count];
  }

  @MessagePattern('get-order')
  async getOne(@Payload() id: number) {
    const order = await this.orderService.getOne(id);

    const lead = await this.amoCrmService.getLead(order.leadId);

    return {
      ...order,
      lead,
    };
  }

  @MessagePattern('create-order')
  async post(
    @Payload('client') client: Client,
    @Payload('order') order: OrderCreateDto,
  ) {
    const { id } = await this.orderService.create(order, client);

    const fullOrder = await this.orderService.getOne(id);

    const description = this.orderService.getDescription(fullOrder);

    const lead = await this.amoCrmService.createLead({
      name: 'TEST',
      description,
      price: 200,
    });

    await this.orderService.update(id, {
      leadId: lead.id,
    });

    return {
      ...fullOrder,
      lead,
    };
  }

  @MessagePattern('edit-order')
  put(@Payload('id') id: number, @Payload('order') order: Partial<Order>) {
    return this.orderService.update(id, order);
  }

  @MessagePattern('delete-order')
  remove(@Payload() id: number) {
    return this.orderService.remove(id);
  }
}
