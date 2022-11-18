import { IsString, IsUUID } from 'class-validator';
export class WalletReplenishBalanceDto {
  @IsUUID()
  walletUuid: string;
  amount: string;

  @IsString()
  signature: string;
}
