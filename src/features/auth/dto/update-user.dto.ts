import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  favoriteIds?: number[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  countries?: object[];
}
