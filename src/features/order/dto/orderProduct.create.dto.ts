import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductCreateDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
