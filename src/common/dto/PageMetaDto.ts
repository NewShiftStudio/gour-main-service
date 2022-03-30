import { TranslatableStringDto } from './TranslatableStringDto';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  @ApiProperty()
  metaTitle?: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  @ApiProperty()
  metaDescription?: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @IsOptional()
  @ApiProperty()
  metaKeywords?: TranslatableStringDto;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isIndexed?: boolean;
}
