import {Body, Controller, Get, Patch, Post} from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ProductGradeService } from '../product/product-grade.service';
import { WalletService } from './wallet.service';
import { WalletChangeValueDto } from './dto/wallet.change-value.dto';
import { WalletConfirmPaymentDto } from './dto/wallet.confirm-payment.dto';
import { ApiTags } from '@nestjs/swagger';

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
  getCurrentWallet() {
    return this.walletService.getById();
  }

  @Get('/:uuid')
  getWalletById() {
    return this.walletService.getById();
  }
}
