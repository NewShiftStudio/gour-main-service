import { Product } from '../../../entity/Product';

export class ProductPromotion {
  title: string;
  value: number; // в процентах
}

export class ProductWithFullCostDto extends Product {
  promotions: ProductPromotion[];
  totalCost: number;
}
