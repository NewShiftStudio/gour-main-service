import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { Order } from '../../entity/Order';
import { Client } from '../../entity/Client';
import { OrderService } from './order.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderCreateDto } from './dto/order-create.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('get-orders')
  getAll(
    @Payload('client') client: Client,
    @Payload('params') params: BaseGetListDto,
  ) {
    return this.orderService.findUsersOrders(params, client);
  }

  @MessagePattern('get-order')
  getOne(@Payload() id: number) {
    return this.orderService.getOne(id);
  }

  @MessagePattern('create-order')
  post(
    @Payload('client') client: Client,
    @Payload('order') order: OrderCreateDto,
  ) {
    return this.orderService.create(order, client);
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
