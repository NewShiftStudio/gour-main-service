import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { Promotion } from '../../entity/Promotion';
import { Image } from '../../entity/Image';
import { Product } from '../../entity/Product';
import { WarehouseService } from '../warehouse/warehouse.service';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports: [WarehouseModule, TypeOrmModule.forFeature([Promotion, Image, Product])],
  providers: [PromotionService, WarehouseService],
  controllers: [PromotionController],
  exports: [PromotionService],
})
export class PromotionModule {}
