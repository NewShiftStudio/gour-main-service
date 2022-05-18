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
  @IsEmail()
  @IsOptional()
  email?: string;

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
  @IsNumber()
  @IsOptional()
  avatarId?: number;
}
