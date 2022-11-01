import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { WalletService } from './wallet.service';
import { WalletChangeValueDto } from './dto/wallet-change-value.dto';
import { GetAmountByCurrencyDto } from './dto/get-amount-by-currency.dto';
import { WalletReplenishBalanceDto } from './dto/wallet-replenish-balance.dto';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @MessagePattern('wallet-replenish-balance')
  replenishBalance(@Payload() dto: WalletReplenishBalanceDto) {
    return this.walletService.replenishBalance(dto);
  }

  @MessagePattern('wallet-change-value')
  changeValue(@Payload() dto: WalletChangeValueDto) {
    return this.walletService.changeSum(
      dto.walletUuid,
      dto.value,
      dto.description,
    );
  }

  @MessagePattern('get-wallet-transactions')
  getWalletTransactionsByClientId(@Payload() userId: string) {
    return this.walletService.getWalletTransactionsByClientId(userId);
  }

  @MessagePattern('get-amount-by-currency')
  getAmountByCurrency(@Payload() dto: GetAmountByCurrencyDto) {
    return this.walletService.getAmountByCurrency(dto.count, dto.currency);
  }

  @MessagePattern('get-client-wallet')
  getCurrentWallet(@Payload() uuid: string) {
    return this.walletService.getByClientId(uuid);
  }

  @MessagePattern('get-client-wallet-balance')
  getCurrentBalance(@Payload() uuid: string) {
    return this.walletService.getBalanceByClientId(uuid);
  }

  @MessagePattern('get-wallet')
  getWalletById(@Payload() uuid: string) {
    return this.walletService.getById(uuid);
  }
}
