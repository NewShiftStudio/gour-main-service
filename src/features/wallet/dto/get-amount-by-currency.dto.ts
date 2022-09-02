import { IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../wallet.service';

export class GetAmountByCurrencyDto {
  @ApiProperty({ description: 'Count of coins' })
  @IsNumber()
  count: number;

  @IsEnum(Currency)
  currency: Currency;
}
