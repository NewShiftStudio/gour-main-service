import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { Promotion } from '../../entity/Promotion';
import { Image } from '../../entity/Image';
import { Product } from '../../entity/Product';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Image, Product])],
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService],
})
export class PromotionModule {}
