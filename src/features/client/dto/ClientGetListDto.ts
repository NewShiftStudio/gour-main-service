import { IsOptional, ValidateNested } from 'class-validator';
import { BaseGetListDto } from '../../../common/dto/BaseGetListDto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClientGetListDto extends BaseGetListDto {
  @IsOptional()
  @ValidateNested()
  @ApiPropertyOptional()
  filter?: {
    isApproved: boolean;
  };
}
