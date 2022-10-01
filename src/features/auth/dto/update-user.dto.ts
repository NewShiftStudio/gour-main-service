import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  favoriteIds?: number[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  countries?: object[];

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  mainOrderProfileId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referralCode?: string;
}
