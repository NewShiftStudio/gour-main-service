import {IsNumber, IsOptional} from 'class-validator';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class PriceDto {
  @IsNumber()
  @IsOptional
  @ApiPropertyOptional()
  cheeseCoin?: number;

  @IsNumber()
  @IsOptional
  @ApiPropertyOptional()
  individual?: number;

  @IsNumber()
  @ApiPropertyOptional()
  company?: number;

  @IsNumber()
  @ApiPropertyOptional()
  companyByCash?: number;
}
