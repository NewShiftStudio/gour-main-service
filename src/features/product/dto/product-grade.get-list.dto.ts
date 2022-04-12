import { BaseGetListDto } from '../../../common/dto/BaseGetListDto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class ProductGradeGetListDto extends BaseGetListDto {
  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  onlyWithComments?: boolean;

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  isApproved?: boolean;
}
