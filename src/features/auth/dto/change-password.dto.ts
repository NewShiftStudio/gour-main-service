import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  prevPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}
