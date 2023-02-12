import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ReferralCodeCreateDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  fullName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phone?: string;
}
