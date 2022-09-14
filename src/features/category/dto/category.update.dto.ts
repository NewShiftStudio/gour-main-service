import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';

export class CategoryUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ValidateNested()
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  subCategoriesIds?: number[];
}
