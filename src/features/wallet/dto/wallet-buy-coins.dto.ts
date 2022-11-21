import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Currency } from '../wallet.service';
export class WalletBuyCoinsDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsUUID()
  payerUuid: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsIP()
  ipAddress: string;

  @IsString()
  signature: string;

  @IsUUID()
  invoiceUuid: string;
}
