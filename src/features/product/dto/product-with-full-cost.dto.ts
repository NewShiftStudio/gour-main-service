import { Product } from '../../../entity/Product';

export class ProductWithFullCostDto extends Product {
  totalCost: number;
}
