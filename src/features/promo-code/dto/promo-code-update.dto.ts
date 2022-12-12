import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PromoCodeUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  key?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  countForOne?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  categoryIds?: number[];
}
