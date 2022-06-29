import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletChangeValueDto } from './dto/wallet.change-value.dto';
import { WalletConfirmPaymentDto } from './dto/wallet.confirm-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { Client } from 'src/entity/Client';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/:uuid')
  confirmPayment(@Body() dto: WalletConfirmPaymentDto) {
    // Webhook handler from payment service
  }

  @Patch('/:uuid')
  changeValue(@Body() dto: WalletChangeValueDto) {
    // Only for admins
  }

  @Get('/current')
  getCurrentWallet(@CurrentUser() user: Client) {
    return this.walletService.getByClientId(user.id);
  }

  @Get('/current-balance')
  getCurrentBalance(@CurrentUser() user: Client) {
    return this.walletService.getBalanceByCLientId(user.id);
  }

  @Get('/:uuid')
  getWalletById(@Param('uuid') uuid: string) {
    return this.walletService.getById(uuid);
  }
}
