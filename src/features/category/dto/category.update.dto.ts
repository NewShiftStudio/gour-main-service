import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';

export class CategoryUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  subCategoriesIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  parentCategoriesIds?: number[];
}
