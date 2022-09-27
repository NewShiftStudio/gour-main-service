import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    default: '+79999999999',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    default: '12345',
  })
  @IsString()
  password: string;
}
