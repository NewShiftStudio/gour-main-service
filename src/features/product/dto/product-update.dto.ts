import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
import { PriceDto } from '../../../common/dto/price.dto';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';
import { RoleDiscountDto } from '../../../common/dto/role-discount.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class ProductUpdateDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableStringDto)
  @ApiPropertyOptional()
  title?: TranslatableStringDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => TranslatableTextDto)
  @ApiPropertyOptional()
  description?: TranslatableTextDto;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  moyskladId?: string;

  @IsArray()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: Number,
    isArray: true,
  })
  images: number[];

  @IsArray()
  @IsOptional()
  @ApiModelPropertyOptional({
    type: Number,
    isArray: true,
  })
  categoryIds?: number[];

  @ValidateNested()
  @Type(() => PriceDto)
  @IsOptional()
  @ApiPropertyOptional()
  price?: PriceDto;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  similarProducts?: number[];

  @ValidateNested()
  @Type(() => PageMetaDto)
  @IsOptional()
  @ApiPropertyOptional()
  meta?: PageMetaDto;

  @ApiModelPropertyOptional({
    isArray: true,
    type: RoleDiscountDto,
  })
  @ValidateNested()
  @IsOptional()
  roleDiscounts?: RoleDiscountDto[];
}
