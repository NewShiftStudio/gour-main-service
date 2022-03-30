import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientRoleCreateDto {
  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  title: string;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  key: string;
}
