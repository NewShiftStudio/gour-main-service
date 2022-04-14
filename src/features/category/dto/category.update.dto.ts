import { TranslatableStringDto } from '../../../common/dto/TranslatableStringDto';
import { TranslatableTextDto } from '../../../common/dto/TranslatableTextDto';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @ApiPropertyOptional()
  description?: TranslatableTextDto;

  @IsString()
  @ApiPropertyOptional()
  key?: string;
}
