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
import {ApiPropertyOptional} from "@nestjs/swagger";

export class PromotionUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @IsOptional()
  @ApiPropertyOptional()
  description?: TranslatableTextDto;

  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  @ApiPropertyOptional()
  cardImage?: ImageDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => ImageDto)
  @ApiPropertyOptional()
  pageImage?: ImageDto;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  discount?: number;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  end?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  start?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  products: number[];
}
