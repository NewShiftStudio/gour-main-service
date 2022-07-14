import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  title: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @ApiProperty()
  description: TranslatableTextDto;

  @IsString()
  @ApiProperty()
  key: string;
}
