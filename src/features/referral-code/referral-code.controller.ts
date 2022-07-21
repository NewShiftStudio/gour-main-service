import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { ReferralCode } from '../../entity/ReferralCode';
import { ReferralCodeService } from './referral-code.service';
import { BaseGetListDto } from '../../common/dto/base-get-list.dto';
import { ReferralCodeCreateDto } from './dto/referral-code-create.dto';
import { ReferralCodeExportDto } from './dto/referral-code-export.dto';

@ApiTags('referralCodes')
@Controller()
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

  @MessagePattern('edit-referral-codes')
  put(@Payload('id') id: number, @Payload('dto') dto: Partial<ReferralCode>) {
    return this.referralCodeService.update(id, dto);
  }

  @MessagePattern('delete-referral-codes')
  remove(@Payload() id: number) {
    return this.referralCodeService.remove(id);
  }

  @MessagePattern('export-referral-codes')
  export(@Payload() params: ReferralCodeExportDto) {
    return this.referralCodeService.getClientStat(params);
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
