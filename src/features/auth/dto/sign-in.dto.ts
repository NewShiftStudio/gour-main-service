import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    default: '+79999999999',
  })
  phone: string;

  @ApiProperty({
    default: '12345',
  })
  @IsString()
  password: string;
}
