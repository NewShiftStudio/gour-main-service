import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';

export class PromotionUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ValidateNested()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: () => TranslatableTextDto,
  })
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
  products?: number[];

  @ValidateNested()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: () => PageMetaDto,
  })
  pageMeta?: PageMetaDto;
}
