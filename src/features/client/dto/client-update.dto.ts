import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ClientUpdateDto {
  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  referralCode?: string;

  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  cityId?: number;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  additionalInfo?: Record<string, string | number>;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  roleId?: number;

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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  warehouseClientId?: string;
}
