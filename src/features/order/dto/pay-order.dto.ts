import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Currency } from 'src/features/wallet/wallet.service';
export class PayOrderDto {
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

  @IsString()
  fullName: string;

  @IsString()
  code: string;
}
