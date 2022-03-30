import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductGetOneDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  withSimilarProducts?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  withMeta?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  withRoleDiscounts?: boolean;
}
