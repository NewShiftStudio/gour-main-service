import { Product } from '../../../entity/Product';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductWithMetricsDto extends Product {
  @ApiPropertyOptional()
  gradesCount?: number;

  @ApiPropertyOptional()
  commentsCount?: number;
}
