import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletTransactionStatus } from '../../../entity/WalletTransaction';

export class WalletConfirmPaymentDto {
  @ApiProperty({
    enum: WalletTransactionStatus,
    default: WalletTransactionStatus.init,
  })
  @IsEnum(WalletTransactionStatus)
  status: WalletTransactionStatus;

  @ApiProperty()
  @IsString()
  token: string;
}
