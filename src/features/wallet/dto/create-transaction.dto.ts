import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Wallet } from 'src/entity/Wallet';
import {
  WalletTransactionStatus,
  WalletTransactionType,
} from 'src/entity/WalletTransaction';

export class createWalletTransactionDto {
  wallet: Wallet;

  @IsEnum(WalletTransactionType)
  type: WalletTransactionType;

  @IsEnum(WalletTransactionStatus)
  status: WalletTransactionStatus;

  @IsNumber()
  prevValue: number;

  @IsNumber()
  newValue: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  signature: string;
}
