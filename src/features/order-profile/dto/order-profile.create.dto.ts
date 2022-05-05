import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderProfileCreateDto {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNumber()
  @ApiProperty()
  cityId: number;

  @IsString()
  @ApiProperty()
  deliveryType: string;

  @IsString()
  @ApiProperty()
  street: string;

  @IsString()
  @ApiProperty()
  house: string;

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
}
