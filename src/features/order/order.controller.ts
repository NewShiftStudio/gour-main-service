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
import { ApiTags } from '@nestjs/swagger';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { Response } from 'express';

@ApiTags('orders')
@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/orders')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clients, count] = await this.orderService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
  }

  @Get('/orders/:id')
  getOne(@Param('id') id: number) {
    return this.orderService.getOne(id);
  }

  @Post('/orders')
  async post(@Body() order: OrderCreateDto) {
    return this.orderService.create(order);
  }

  @Put('/orders/:id')
  put(@Param('id') id: number, @Body() order: Partial<Order>) {
    return this.orderService.update(id, order);
  }

  @Delete('/orders/:id')
  remove(@Param('id') id: number) {
    return this.orderService.remove(id);
  }
}
