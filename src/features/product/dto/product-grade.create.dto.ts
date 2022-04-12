import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductGradeCreateDto {
  @IsNumber()
  @ApiProperty()
  value: number;

  @IsString()
  @ApiProperty()
  comment: string;
}
