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
import { AmoCrmService } from './amo-crm.service';
import { LeadDto } from './dto/lead.dto';
import { OrderProduct } from '../../entity/OrderProduct';
import { ProductService } from '../product/product.service';

@ApiBearerAuth()
@ApiTags('orders')
@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly amoCrmService: AmoCrmService,
    private readonly productService: ProductService,
  ) {}

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
    const leads = await this.amoCrmService.getLeadList();

    const leadsById = leads.reduce((acc, it) => {
      acc[it.id] = it;
      return acc;
    });

    const [orders, count] = await this.orderService.findUsersOrders(
      params,
      client,
    );

    const response: OrderExtendedDto[] = orders.map((order) => ({
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

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(response);
  }

  @Get('/orders/:id')
  async getOne(@Param('id') id: string) {
    const order = await this.orderService.getOne(+id);
    const lead = await this.amoCrmService.getLead(order.leadId);

    return {
      ...order,
      lead,
    };
  }

  @Post('/orders')
  async post(
    @CurrentUser() currentUser: Client,
    @Body() order: OrderCreateDto,
  ) {
    const { id } = await this.orderService.create(order, currentUser);
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
    //
    return {
      ...fullOrder,
      lead,
    };
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
