import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../entity/Wallet';
import { WalletChange } from '../../entity/WalletChange';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletChange])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
