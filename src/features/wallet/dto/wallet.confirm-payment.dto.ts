import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WalletChangeStatus } from '../../../entity/WalletChange';

export class WalletConfirmPaymentDto {
  @ApiProperty({
    enum: WalletChangeStatus,
    default: WalletChangeStatus.approved,
  })
  @IsEnum(WalletChangeStatus)
  status: WalletChangeStatus;

  @ApiProperty()
  @IsString()
  token: string;
}
