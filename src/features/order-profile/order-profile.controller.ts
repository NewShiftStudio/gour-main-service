import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OrderProfileService } from './order-profile.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { Client } from '../../entity/Client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderProfileUpdateDto } from './dto/order-profile.update.dto';

@ApiBearerAuth()
@ApiTags('orderProfile')
@Controller()
export class OrderProfileController {
  constructor(private readonly orderProfileService: OrderProfileService) {}

  @Get('/order-profiles')
  getAll(@Query() params: BaseGetListDto, @CurrentUser() currentUser: Client) {
    return this.orderProfileService.findMany(currentUser, params);
  }

  @Get('/order-profiles/:id')
  getOne(@Param('id') id: string) {
    return this.orderProfileService.getOne(+id);
  }

  @Post('/order-profiles')
  async post(
    @Body() orderProfile: OrderProfileCreateDto,
    @CurrentUser() currentUser: Client,
  ) {
    return this.orderProfileService.create(orderProfile, currentUser);
  }

  @Put('/order-profiles/:id')
  put(@Param('id') id: string, @Body() dto: OrderProfileUpdateDto) {
    return this.orderProfileService.update(+id, dto);
  }

  @Delete('/order-profiles/:id')
  remove(@Param('id') id: string) {
    return this.orderProfileService.remove(+id);
  }
}
