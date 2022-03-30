import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
  @IsNumber()
  @ApiProperty()
  rub: number;

  @IsNumber()
  @ApiProperty()
  eur: number;
}
