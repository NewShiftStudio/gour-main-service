import { BaseGetListDto } from '../../../common/dto/base-get-list.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProductGetSimilarDto extends BaseGetListDto {
  @ApiProperty()
  @IsString()
  productIds: string;
}
