import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ReferralCodeController } from './referral-code.controller';
import { ReferralCodeService } from './referral-code.service';
import { ReferralCode } from '../../entity/ReferralCode';
import { Client } from '../../entity/Client';
import { Order } from '../../entity/Order';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PAYMENT_SERVICE_HOST,
          port: +process.env.PAYMENT_SERVICE_PORT,
        },
      },
    ]),
    TypeOrmModule.forFeature([ReferralCode, Client, Order]),
  ],
  controllers: [ReferralCodeController],
  providers: [ReferralCodeService],
})
export class ReferralCodeModule {}
