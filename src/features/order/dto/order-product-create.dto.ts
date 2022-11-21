import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductCreateDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  gram: number;
}
