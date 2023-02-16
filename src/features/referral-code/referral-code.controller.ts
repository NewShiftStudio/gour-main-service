import { Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { ReferralCodeService } from './referral-code.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ReferralCodeCreateDto } from './dto/referral-code-create.dto';
import { ReferralCodeEditDto } from './dto/referral-code-edit.dto';
import { ExportDto } from 'src/common/dto/export.dto';

@ApiTags('referral-codes')
@Controller('referral-codes')
export class ReferralCodeController {
  constructor(private readonly referralCodeService: ReferralCodeService) {}

  @MessagePattern('get-referral-codes')
  getAll(@Payload() params: BaseGetListDto) {
    return this.referralCodeService.findMany(params);
  }

  @MessagePattern('create-referral-code')
  post(@Payload() dto: ReferralCodeCreateDto) {
    return this.referralCodeService.create(dto);
  }

  @MessagePattern('edit-referral-code')
  put(@Payload('id') id: number, @Payload('dto') dto: ReferralCodeEditDto) {
    return this.referralCodeService.update(id, dto);
  }

  @MessagePattern('delete-referral-code')
  remove(@Payload() id: number) {
    return this.referralCodeService.remove(id);
  }

  @MessagePattern('get-referrals')
  export(
    @Payload('params') params: BaseGetListDto,
    @Payload('dto') dto: ExportDto,
  ) {
    return this.referralCodeService.getReferrals(params, dto);
  }

  @MessagePattern('get-volume')
  // @Get('volume')
  exportVolume(
    @Payload('dto') dto: ExportDto,
  ) {
    return this.referralCodeService.getVolume(dto);
  }

  @MessagePattern('get-referral-discount')
  getDiscount() {
    return this.referralCodeService.getDiscount();
  }

  @MessagePattern('edit-referral-discount')
  setDiscount(@Payload() discount: number) {
    return this.referralCodeService.setDiscount(discount);
  }
}
