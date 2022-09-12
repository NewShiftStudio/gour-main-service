import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
import { PriceDto } from '../../../common/dto/price.dto';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RoleDiscountDto } from '../../../common/dto/role-discount.dto';
import { Column } from 'typeorm';

export class ProductCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  title: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @ApiProperty()
  description: TranslatableTextDto;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  moyskladCode?: number;

  @IsArray()
  @ApiModelProperty({
    type: Number,
    isArray: true,
  })
  images: number[];

  @ValidateNested()
  @Type(() => PriceDto)
  @ApiProperty()
  price: PriceDto;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  productCategories?: number[];

  @IsArray()
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

  @ApiProperty()
  @Column()
  isWeightGood: boolean;
}
