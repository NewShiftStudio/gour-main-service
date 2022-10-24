import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ProductUpdateDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableStringDto)
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableTextDto)
  @ApiPropertyOptional()
  description?: TranslatableTextDto;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  moyskladId?: string;

  @IsArray()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: Number,
    isArray: true,
  })
  images: number[];

  @IsArray()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: Number,
    isArray: true,
  })
  categoryIds?: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  similarProducts?: number[];

  @ValidateNested()
  @Type(() => PageMetaDto)
  @IsOptional()
  @ApiPropertyOptional()
  meta?: PageMetaDto;
}
