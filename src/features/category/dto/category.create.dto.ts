import { TranslatableStringDto } from '../../../common/dto/TranslatableStringDto';
import { TranslatableTextDto } from '../../../common/dto/TranslatableTextDto';
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
