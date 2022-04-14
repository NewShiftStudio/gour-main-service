import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageCreateDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PageMetaDto)
  meta: PageMetaDto;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  info: Record<string, string | number>;
}
