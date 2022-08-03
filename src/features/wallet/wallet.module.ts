import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../entity/Wallet';
import { WalletTransaction } from 'src/entity/WalletTransaction';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletTransaction])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
