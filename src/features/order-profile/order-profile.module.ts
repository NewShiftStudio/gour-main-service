import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderProfileController } from './order-profile.controller';
import { OrderProfileService } from './order-profile.service';
import { OrderProfile } from '../../entity/OrderProfile';
import { City } from '../../entity/City';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProfile, City])],
  controllers: [OrderProfileController],
  providers: [OrderProfileService],
})
export class OrderProfileModule {}
