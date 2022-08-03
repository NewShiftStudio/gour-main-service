import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class ClientCreateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsNumber()
  code: number;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  referralCode: string;

  @ApiProperty()
  @IsNumber()
  cityId: number;

  @ApiProperty()
  @IsNumber()
  roleId: number;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  additionalInfo?: Record<string, string | number>;
}
