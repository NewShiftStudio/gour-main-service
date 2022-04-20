import { Module } from '@nestjs/common';
import { OrderProfileController } from './order-profile.controller';
import { OrderProfileService } from './order-profile.service';

@Module({
  controllers: [OrderProfileController],
  providers: [OrderProfileService]
})
export class OrderProfileModule {}
