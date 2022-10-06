import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DiscountService } from './discount.service';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // TODO: контроллеры добавления и удаления скидок
}
