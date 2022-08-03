import { BaseGetListDto } from '../../../common/dto/base-get-list.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

export class ProductGradeGetListDto extends BaseGetListDto {
  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  withComments?: 'false' | 'true';

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  isApproved?: 'false' | 'true';

  @ApiPropertyOptional()
  @IsBooleanString()
  @IsOptional()
  waitConfirmation?: 'false' | 'true';
}
