import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
  @IsNumber()
  @ApiProperty()
  cheeseCoin: number;

  @IsNumber()
  @ApiProperty()
  individual: number;

  @IsNumber()
  @ApiProperty()
  company: number;

  @IsNumber()
  @ApiProperty()
  companyByCash: number;
}
