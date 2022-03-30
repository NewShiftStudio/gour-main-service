import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientUpdateDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  apiUserUuid?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  role?: number;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  additionalInfo?: Record<string, string | number>;
}
