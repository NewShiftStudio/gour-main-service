import {IsNumber, IsOptional} from 'class-validator';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class PriceDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  cheeseCoin?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  individual?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  company?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  companyByCash?: number;
}
