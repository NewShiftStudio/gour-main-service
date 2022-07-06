import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/TranslatableStringDto';
import { TranslatableTextDto } from '../../../common/dto/TranslatableTextDto';
import { PriceDto } from '../../../common/dto/PriceDto';
import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApiModelProperty,
  ApiModelPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { RoleDiscountDto } from '../../../common/dto/RoleDiscountDto';
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

  @IsNumber()
  @ApiProperty()
  category: number;

  @ValidateNested()
  @Type(() => PriceDto)
  @ApiProperty()
  price: PriceDto;

  @IsObject()
  @ApiProperty()
  characteristics: Record<string, string | number>;

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
