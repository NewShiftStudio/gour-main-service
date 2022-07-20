import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ReferralCodeSetDiscountDto {
  @IsNumber()
  @ApiProperty()
  discount: number;
}
