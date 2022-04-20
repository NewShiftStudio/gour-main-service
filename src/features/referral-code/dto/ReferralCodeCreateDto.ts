import { ApiProperty } from '@nestjs/swagger';
import {IsNumber, IsString} from 'class-validator';

export class ReferralCodeCreateDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsNumber()
  @ApiProperty()
  discount: number;
}
