import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

import { WalletService } from './wallet.service';
import { WalletChangeValueDto } from './dto/wallet-change-value.dto';
import { WalletConfirmPaymentDto } from './dto/wallet-confirm-payment.dto';

@ApiTags('wallet')
@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @MessagePattern('wallet-confirm-payment')
  confirmPayment(@Payload() dto: WalletConfirmPaymentDto) {
    console.log(dto);
    // Webhook handler from payment service
  }

  @MessagePattern('wallet-change-value')
  changeValue(@Payload() dto: WalletChangeValueDto) {
    console.log(dto);
    // Only for admins
  }

  @MessagePattern('get-client-wallet')
  getCurrentWallet(@Payload() id: number) {
    return this.walletService.getByClientId(id);
  }

  @MessagePattern('get-client-wallet-balance')
  getCurrentBalance(@Payload() id: number) {
    return this.walletService.getBalanceByClientId(id);
  }

  @MessagePattern('get-wallet')
  getWalletById(@Payload() uuid: string) {
    return this.walletService.getById(uuid);
  }
}
