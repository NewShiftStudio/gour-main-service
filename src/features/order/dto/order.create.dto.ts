import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { OrderProductCreateDto } from './orderProduct.create.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderCreateDto {
  @IsArray()
  @ValidateNested()
  @Type(() => OrderProductCreateDto)
  @ApiProperty()
  orderProducts: OrderProductCreateDto[];

  @IsNumber()
  @ApiProperty()
  client: number;

  @IsNumber()
  @ApiProperty()
  orderProfile: number;

  @IsString()
  @ApiProperty()
  comment: string;
}
