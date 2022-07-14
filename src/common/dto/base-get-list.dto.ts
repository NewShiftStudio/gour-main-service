import { IsDecimal, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseGetListDto {
  @IsDecimal()
  @IsOptional()
  @ApiPropertyOptional()
  length?: string;

  @IsDecimal()
  @IsOptional()
  @ApiPropertyOptional()
  offset?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  q?: string;
}
