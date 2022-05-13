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
  Res,
} from '@nestjs/common';
import { ReferralCodeCreateDto } from './dto/ReferralCodeCreateDto';
import { ReferralCodeService } from './referral-code.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { ApiTags } from '@nestjs/swagger';
import { ReferralCodeExportDto } from './dto/referral-code.export.dto';
import { ReferralCodeSetDiscountDto } from './dto/referral-code.set-discount.dto';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { Readable } from 'stream';
import { Client } from '../../entity/Client';

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

  @Get('/referralCodes/export')
  async export(@Query() params: ReferralCodeExportDto, @Res() res: Response) {
    const clients = await this.referralCodeService.getClientStat(params);

    const wb = this.makeBook(clients);
    const fileName = `referral_codes_export_${new Date().toISOString()}`;
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}.xlsx"`,
    });
    return res
      .status(200)
      .send(XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
  }

  @Get('/referralCodes/discount')
  getDiscount() {
    return this.referralCodeService.getDiscount();
  }

  @Post('/referralCodes/discount')
  setDiscount(@Body() { discount }: ReferralCodeSetDiscountDto) {
    return this.referralCodeService.setDiscount(discount);
  }

  makeBook(clients: Client[]) {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Code', 'Client Name', 'Date'],
      ...clients.map((client) => [
        client.referralCode.code,
        client.name,
        client.createdAt,
      ]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
    return wb;
  }
}
