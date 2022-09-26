import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';

export class CategoryCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  title: TranslatableStringDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  subCategoriesIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  parentCategoriesIds?: number[];
}
