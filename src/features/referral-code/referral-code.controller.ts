import { ReferralCode } from '../../entity/ReferralCode';
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
import { ReferralCodeCreateDto } from './dto/ReferralCodeCreateDto';
import { ReferralCodeService } from './referral-code.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('referralCodes')
@Controller()
export class ReferralCodeController {
  constructor(private readonly referralCodeService: ReferralCodeService) {}

  @Get('/referralCodes')
  getAll(@Query() params: BaseGetListDto) {
    return this.referralCodeService.findMany(params);
  }

  @Post('/referralCodes')
  async post(@Body() referralCode: ReferralCodeCreateDto) {
    return this.referralCodeService.create(referralCode);
  }

  @Put('/referralCodes/:id')
  put(@Param('id') id: string, @Body() referralCode: Partial<ReferralCode>) {
    return this.referralCodeService.update(+id, referralCode);
  }

  @Delete('/referralCodes/:id')
  remove(@Param('id') id: string) {
    return this.referralCodeService.remove(+id);
  }
}
