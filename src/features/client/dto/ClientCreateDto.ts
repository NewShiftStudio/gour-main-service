import {IsNumber, IsObject, IsOptional, IsString, IsUUID} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClientCreateDto {
  @IsUUID()
  @ApiProperty()
  apiUserUuid: string;

  @IsNumber()
  @ApiProperty()
  role: number;

  @IsObject()
  @IsOptional()
  @ApiPropertyOptional()
  additionalInfo?: Record<string, string | number>;
}
