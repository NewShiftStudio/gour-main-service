import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReferralCodeCreateDto {
  @IsString()
  @ApiProperty()
  code: string;
}
