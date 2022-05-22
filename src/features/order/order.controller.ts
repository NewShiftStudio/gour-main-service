import { Order } from '../../entity/Order';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { OrderCreateDto } from './dto/order.create.dto';
import { OrderService } from './order.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { Response } from 'express';
import { CurrentUser } from '../auth/current-user.decorator';
import { Client } from '../../entity/Client';
import { OrderExtendedDto } from './dto/order.extended.dto';

@ApiBearerAuth()
@ApiTags('orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/orders')
  @ApiResponse({
    isArray: true,
    type: OrderExtendedDto,
  })
  async getAll(
    @CurrentUser() client: Client,
    @Query() params: BaseGetListDto,
    @Res() res: Response,
  ) {
    const [orders, count] = await this.orderService.findUsersOrders(
      params,
      client,
    );

    // TODO: интегрировать амо, сделать расчет скидок
    const response: OrderExtendedDto[] = orders.map((order) => ({
      order,
      crmInfo: {
        id: 'TX-123456789',
        status: {
          name: 'Создан',
          color: '#0f0',
        },
      },
      promotions: [
        {
          title: 'Скидка за наеденность',
          value: 100,
          currency: 'rub',
        },
      ],
    }));

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(response);
  }

  @Get('/orders/:id')
  getOne(@Param('id') id: string) {
    return this.orderService.getOne(+id);
  }

  @Post('/orders')
  async post(
    @CurrentUser() currentUser: Client,
    @Body() order: OrderCreateDto,
  ) {
    return this.orderService.create(order, currentUser);
  }

  @Put('/orders/:id')
  put(@Param('id') id: string, @Body() order: Partial<Order>) {
    return this.orderService.update(+id, order);
  }

  @Delete('/orders/:id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
