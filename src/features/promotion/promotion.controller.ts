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
import { PromotionCreateDto } from './dto/promotion.create.dto';
import { PromotionService } from './promotion.service';
import { BaseGetListDto } from '../../common/dto/BaseGetListDto';
import { PromotionUpdateDto } from './dto/promotion.update.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('promotions')
@Controller()
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('/promotions')
  getAll(@Query() params: BaseGetListDto) {
    return this.promotionService.findMany(params);
  }

  @Get('/promotions/:id')
  getOne(@Param('id') id: number) {
    return this.promotionService.getOne(id);
  }

  @Post('/promotions')
  async post(@Body() promotion: PromotionCreateDto) {
    return this.promotionService.create(promotion);
  }

  @Put('/promotions/:id')
  put(@Param('id') id: number, @Body() promotion: PromotionUpdateDto) {
    return this.promotionService.update(id, promotion);
  }

  @Delete('/promotions/:id')
  remove(@Param('id') id: number) {
    return this.promotionService.remove(id);
  }
}
