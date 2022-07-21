import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TranslatableStringDto } from '../../../common/dto/translatable-string.dto';
import { TranslatableTextDto } from '../../../common/dto/translatable-text.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from '../../../common/dto/page-meta.dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class PromotionCreateDto {
  @ValidateNested()
  @Type(() => TranslatableStringDto)
  @ApiProperty()
  title: TranslatableStringDto;

  @ValidateNested()
  @Type(() => TranslatableTextDto)
  @ApiProperty()
  description: TranslatableTextDto;

  @IsNumber()
  @ApiProperty()
  cardImageId: number;

  @IsNumber()
  @ApiProperty()
  pageImageId: number;

  @IsNumber()
  @ApiProperty()
  discount: number;

  @IsDateString()
  @ApiProperty()
  end: string;

  @IsDateString()
  @ApiProperty()
  start: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  products: number[];

  @ValidateNested()
  @ApiModelProperty({
    type: () => PageMetaDto,
  })
  pageMeta: PageMetaDto;
}
