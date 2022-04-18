import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpDto {
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
}
