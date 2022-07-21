import { PageMetaDto } from '../../../common/dto/page-meta.dto';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PageUpdateDto {
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => PageMetaDto)
  meta: PageMetaDto;

  @ApiPropertyOptional()
  @IsString()
  key: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  info: Record<string, string | number>;
}
