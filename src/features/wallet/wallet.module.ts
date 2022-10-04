import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from '../../entity/Wallet';
import { WalletTransaction } from '../../entity/WalletTransaction';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransaction])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
