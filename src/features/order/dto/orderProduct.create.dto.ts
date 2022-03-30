import { IsNumber } from 'class-validator';

export class OrderProductCreateDto {
  @IsNumber()
  product: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  amount: number;
}
