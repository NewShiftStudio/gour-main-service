import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

export class PromoCodeCreateDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsDateString()
  end: string;

  @ApiProperty()
  @IsNumber()
  totalCount: number;

  @ApiProperty()
  @IsNumber()
  countForOne: number;

  @ApiProperty()
  @IsArray()
  categoryIds: number[];
}
