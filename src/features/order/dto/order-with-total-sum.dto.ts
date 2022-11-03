import { OrderProduct } from '../../../entity/OrderProduct';
import { ProductWithFullCostDto } from '../../product/dto/product-with-full-cost.dto';
import { Order } from '../../../entity/Order';

export class OrderPromotion {
  title: string;
  value: number;
}

export class OrderProductWithTotalSumDto extends OrderProduct {
  product: ProductWithFullCostDto;
  totalSum: number;
  totalSumWithoutAmount: number;
}

export class OrderWithTotalSumDto extends Order {
  orderProducts: OrderProductWithTotalSumDto[];
  totalSum: number;
  promotions: OrderPromotion[];
}
