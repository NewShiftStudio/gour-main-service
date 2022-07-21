import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PromotionGetOneDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  withProducts?: boolean;
}
