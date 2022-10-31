import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from '../../entity/Wallet';
import { WalletTransaction } from '../../entity/WalletTransaction';
import { ClientModule } from '../client/client.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    TypeOrmModule.forFeature([Wallet, WalletTransaction]),
    forwardRef(() => ClientModule),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
