import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  favoriteIds?: number[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  countries?: object[];
}
