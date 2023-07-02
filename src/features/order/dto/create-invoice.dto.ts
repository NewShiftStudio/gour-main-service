import {IsEnum, IsNumber, IsObject, IsOptional, IsUUID} from 'class-validator';
import { Currency } from 'src/features/wallet/wallet.service';

export class InvoiceCreateDto {
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  value: number;

  @IsObject()
  meta: object; // some meta information

  @IsUUID()
  @IsOptional()
  payerUuid?: string;
}
