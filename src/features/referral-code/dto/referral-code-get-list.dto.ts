import { BaseGetListDto } from '../../../common/dto/base-get-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ReferralCodeGetListDto extends BaseGetListDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  end?: string;
}
