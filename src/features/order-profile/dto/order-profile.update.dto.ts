import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderProfileUpdateDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  cityId?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  street?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  house?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  apartment?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  entrance?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  floor?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  comment?: string;
}
