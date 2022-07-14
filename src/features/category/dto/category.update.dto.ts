import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
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
