import { IsBoolean, IsBooleanString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductGetOneDto {
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
  withMetrics?: boolean;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  withGrades?: boolean;
}
