import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../entity/Client';
import { OrderProfileService } from './order-profile.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { OrderProfileUpdateDto } from './dto/order-profile.update.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiBearerAuth()
@ApiTags('orderProfile')
@Controller()
export class OrderProfileController {
  constructor(private readonly orderProfileService: OrderProfileService) {}

  @MessagePattern('get-order-profiles')
  getAll(
    @Payload() params: BaseGetListDto,
    @CurrentUser() currentUser: Client,
  ) {
    return this.orderProfileService.findMany(currentUser, params);
  }

  @MessagePattern('get-order-profile')
  getOne(@Payload() id: string) {
    return this.orderProfileService.getOne(+id);
  }

  @MessagePattern('create-order-profile')
  post(
    @Payload() orderProfile: OrderProfileCreateDto,
    @CurrentUser() currentUser: Client,
  ) {
    return this.orderProfileService.create(orderProfile, currentUser);
  }

  @MessagePattern('edit-order-profile')
  put(
    @Payload('id') id: string,
    @Payload('orderProfile') orderProfile: OrderProfileUpdateDto,
  ) {
    return this.orderProfileService.update(+id, orderProfile);
  }

  @MessagePattern('delete-order-profile')
  remove(@Payload() id: string) {
    return this.orderProfileService.remove(+id);
  }
}
