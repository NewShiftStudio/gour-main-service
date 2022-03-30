import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/TranslatableStringDto';
import { TranslatableTextDto } from '../../../common/dto/TranslatableTextDto';
import { ImageDto } from '../../../common/dto/ImageDto';
import { ApiProperty } from '@nestjs/swagger';

export class PromotionCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  title: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @ApiProperty()
  description: TranslatableTextDto;

  @ValidateNested()
  @Type(() => ImageDto)
  @ApiProperty()
  cardImage: ImageDto;

  @ValidateNested()
  @Type(() => ImageDto)
  @ApiProperty()
  pageImage: ImageDto;

  @IsNumber()
  @ApiProperty()
  discount: number;

  @IsDateString()
  @ApiProperty()
  end: string;

  @IsDateString()
  @ApiProperty()
  start: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  products: number[];
}
