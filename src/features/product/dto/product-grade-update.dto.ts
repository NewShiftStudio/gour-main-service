import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductGradeUpdateDto {
  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  isApproved?: boolean;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  value?: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiPropertyOptional()
  comment?: string;
}
