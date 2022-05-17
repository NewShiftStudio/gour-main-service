import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientUpdateDto {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  role?: number;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  additionalInfo?: Record<string, string | number>;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  favoriteIds?: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  countries?: object[];

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  avatarId?: number;
}
