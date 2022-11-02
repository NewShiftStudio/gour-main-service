import {
  IsEmail,
  IsEnum,
  IsIP,
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
  email: string;

  @IsIP()
  ipAddress: string;

  @IsString()
  signature: string;

  @IsUUID()
  invoiceUuid: string;
}
