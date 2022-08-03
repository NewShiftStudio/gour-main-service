import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientRoleUpdateDto {
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  key?: string;
}
