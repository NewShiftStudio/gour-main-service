import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
  @IsNumber()
  @ApiProperty()
  cheeseCoin: number;
}
