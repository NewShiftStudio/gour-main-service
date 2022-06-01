import { OrderProduct } from '../../../entity/OrderProduct';
import {
  ProductPromotion,
  ProductWithFullCostDto,
} from '../../product/dto/product-with-full-cost.dto';
import { Order } from '../../../entity/Order';

export class OrderProductWithTotalSumDto extends OrderProduct {
  product: ProductWithFullCostDto;
  totalSum: number;
}

export class OrderWithTotalSumDto extends Order {
  orderProducts: OrderProductWithTotalSumDto[];
  totalSum: number;
  promotions: ProductPromotion[];
}
