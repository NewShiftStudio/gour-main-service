import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferralCodeController } from './referral-code.controller';
import { ReferralCodeService } from './referral-code.service';
import { ReferralCode } from '../../entity/ReferralCode';
import { Client } from '../../entity/Client';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCode, Client])],
  controllers: [ReferralCodeController],
  providers: [ReferralCodeService],
})
export class ReferralCodeModule {}
