import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { BaseGetListDto } from 'src/common/dto/base-get-list.dto';
import { PromoCodeCheckDto } from './dto/promo-code-check.dto';
import { PromoCodeCreateDto } from './dto/promo-code-create.dto';
import { PromoCodeUpdateDto } from './dto/promo-code-update.dto';

import { PromoCodeService } from './promo-code.service';

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @MessagePattern('get-promo-codes')
  getAll(@Payload() params: BaseGetListDto) {
    return this.promoCodeService.findMany(params);
  }

  @MessagePattern('get-promo-code')
  getOne(@Payload() id: number) {
    return this.promoCodeService.getOne(id);
  }

  @MessagePattern('apply-promo-code')
  apply(
    @Payload('dto') dto: PromoCodeCheckDto,
    @Payload('clientId') clientId: string,
  ) {
    return this.promoCodeService.apply(dto, clientId);
  }

  @MessagePattern('create-promo-code')
  post(@Payload('dto') dto: PromoCodeCreateDto) {
    return this.promoCodeService.create(dto);
  }

  @MessagePattern('edit-promo-code')
  put(@Payload('id') id: number, @Payload('dto') dto: PromoCodeUpdateDto) {
    return this.promoCodeService.update(id, dto);
  }

  @MessagePattern('delete-promo-code')
  remove(@Payload() id: number) {
    return this.promoCodeService.remove(id);
  }
}
