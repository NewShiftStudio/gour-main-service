import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entity/Category';

import { PromoCode } from 'src/entity/PromoCode';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCode, Category])],
  controllers: [PromoCodeController],
  providers: [PromoCodeService],
  exports: [PromoCodeService],
})
export class PromoCodeModule {}
