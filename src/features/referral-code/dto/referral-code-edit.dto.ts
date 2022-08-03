import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReferralCodeEditDto {
  @IsString()
  @ApiProperty()
  code: string;
}
