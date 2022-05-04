import {
  IsArray,
  IsEmail,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  address: string;
}
