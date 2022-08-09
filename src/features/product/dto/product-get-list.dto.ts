import { IsBooleanString, IsOptional } from 'class-validator';
import { BaseGetListDto } from '../../../common/dto/base-get-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductGetListDto extends BaseGetListDto {
  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  withSimilarProducts?: boolean;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  withMeta?: boolean;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  withRoleDiscounts?: boolean;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  withDiscount?: boolean;
}
