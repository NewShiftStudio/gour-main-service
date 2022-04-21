import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReferralCodeExportDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  end?: string;
}
