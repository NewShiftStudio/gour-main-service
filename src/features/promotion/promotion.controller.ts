import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { PromotionService } from './promotion.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { PromotionCreateDto } from './dto/promotion-create.dto';
import { PromotionUpdateDto } from './dto/promotion-update.dto';

@ApiTags('promotions')
@Controller()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @MessagePattern('get-promotions')
  getAll(@Payload() params: BaseGetListDto) {
    return this.promotionService.findMany(params);
  }

  @MessagePattern('get-promotion')
  getOne(@Payload() id: number) {
    return this.promotionService.getOne(id);
  }

  @MessagePattern('create-promotion')
  post(@Payload() dto: PromotionCreateDto) {
    return this.promotionService.create(dto);
  }

  @MessagePattern('edit-promotion')
  put(@Payload('id') id: number, @Payload('dto') dto: PromotionUpdateDto) {
    return this.promotionService.update(id, dto);
  }

  @MessagePattern('delete-promotion')
  remove(@Payload() id: number) {
    return this.promotionService.remove(id);
  }
}
