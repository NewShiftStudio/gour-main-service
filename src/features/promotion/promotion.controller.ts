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
import { PromotionCreateDto } from './dto/promotion.create.dto';
import { PromotionService } from './promotion.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { PromotionUpdateDto } from './dto/promotion.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { TOTAL_COUNT_HEADER } from '../../constants/httpConstants';
import { Response } from 'express';

@ApiTags('promotions')
@Controller()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('/promotions')
  async getAll(@Query() params: BaseGetListDto, @Res() res: Response) {
    const [clients, count] = await this.promotionService.findMany(params);

    res.set(TOTAL_COUNT_HEADER, count.toString());
    return res.send(clients);
  }

  @Get('/promotions/:id')
  getOne(@Param('id') id: string) {
    return this.promotionService.getOne(+id);
  }

  @Post('/promotions')
  async post(@Body() promotion: PromotionCreateDto) {
    return this.promotionService.create(promotion);
  }

  @Put('/promotions/:id')
  put(@Param('id') id: string, @Body() promotion: PromotionUpdateDto) {
    return this.promotionService.update(+id, promotion);
  }

  @Delete('/promotions/:id')
  remove(@Param('id') id: string) {
    return this.promotionService.remove(+id);
  }
}
