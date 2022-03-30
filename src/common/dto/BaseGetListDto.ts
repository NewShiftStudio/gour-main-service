import {IsDecimal, IsNumber, IsOptional, IsString} from 'class-validator';
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

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
