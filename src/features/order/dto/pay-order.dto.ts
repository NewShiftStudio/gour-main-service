import {
  IsEmail,
  IsEnum,
  IsIP,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Currency } from 'src/features/wallet/wallet.service';
export class PayOrderDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsUUID()
  @ValidateIf(o => o.payerUuid !== '')
  @IsOptional()
  payerUuid?: string;

  @IsEmail()
  @IsOptional()
  @ValidateIf(o => o.email !== '')
  email?: string;

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
