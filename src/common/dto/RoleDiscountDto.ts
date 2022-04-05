import { IsNumber, IsOptional } from 'class-validator';
import { ClientRole } from '../../entity/ClientRole';
import { IsEntityExists } from '../validationDecorators/IsEntityExists';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class RoleDiscountDto {
  @IsEntityExists(() => ClientRole)
  @ApiProperty()
  role: number;

  // @IsNumber()
  // @IsOptional()
  // @ApiPropertyOptional()
  // value?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  rub?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  eur?: number;
}
