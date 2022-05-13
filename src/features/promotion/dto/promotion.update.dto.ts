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
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PageMetaDto } from '../../../common/dto/PageMetaDto';

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

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  cardImageId?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  pageImageId?: number;

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

  @ValidateNested()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: () => PageMetaDto,
  })
  pageMeta: PageMetaDto;
}
