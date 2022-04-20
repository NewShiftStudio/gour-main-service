import { Module } from '@nestjs/common';
import { ReferralCodeController } from './referral-code.controller';
import { ReferralCodeService } from './referral-code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralCode } from '../../entity/ReferralCode';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCode])],
  controllers: [ReferralCodeController],
  providers: [ReferralCodeService],
})
export class ReferralCodeModule {}
