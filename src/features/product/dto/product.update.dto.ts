import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/TranslatableStringDto';
import { TranslatableTextDto } from '../../../common/dto/TranslatableTextDto';
import { ImageDto } from '../../../common/dto/ImageDto';
import { PriceDto } from '../../../common/dto/PriceDto';
import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { RoleDiscountDto } from '../../../common/dto/RoleDiscountDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

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

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  category?: number;

  @ValidateNested()
  @Type(() => PriceDto)
  @IsOptional()
  @ApiPropertyOptional()
  price?: PriceDto;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  characteristics?: Record<string, string | number>;

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
