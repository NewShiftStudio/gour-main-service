import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Client } from '../../entity/Client';
import { OrderProfileService } from './order-profile.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { OrderProfileCreateDto } from './dto/order-profile.create.dto';
import { OrderProfileUpdateDto } from './dto/order-profile.update.dto';

@ApiBearerAuth()
@ApiTags('order-profiles')
@Controller('order-profiles')
export class OrderProfileController {
  constructor(private readonly orderProfileService: OrderProfileService) {}

  @MessagePattern('get-order-profiles')
  getAll(
    @Payload('params') params: BaseGetListDto,
    @Payload('client') client: Client,
  ) {
    return this.orderProfileService.findMany(client, params);
  }

  @MessagePattern('get-order-profile')
  getOne(@Payload() id: number) {
    return this.orderProfileService.getOne(id);
  }

  @MessagePattern('create-order-profile')
  post(
    @Payload('dto') dto: OrderProfileCreateDto,
    @Payload('client') client: Client,
  ) {
    return this.orderProfileService.create(dto, client);
  }

  @MessagePattern('edit-order-profile')
  put(@Payload('id') id: number, @Payload('dto') dto: OrderProfileUpdateDto) {
    return this.orderProfileService.update(id, dto);
  }

  @MessagePattern('delete-order-profile')
  remove(@Payload() id: number) {
    return this.orderProfileService.remove(id);
  }
}
