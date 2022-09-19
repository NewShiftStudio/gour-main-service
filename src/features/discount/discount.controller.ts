import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DiscountService } from './discount.service';
import { Client } from 'src/entity/Client';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @MessagePattern('get-discounts')
  findByClient(@Payload('client') client: Client) {
    return this.discountService.findByClient(client);
  }
}
