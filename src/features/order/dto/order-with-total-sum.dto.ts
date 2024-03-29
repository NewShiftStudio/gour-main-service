import { OrderProduct } from '../../../entity/OrderProduct';
import { Order } from '../../../entity/Order';
import { Product } from 'src/entity/Product';

export class OrderDiscount {
  title: string;
  value: number;
}

export class OrderProductWithTotalSumDto extends OrderProduct {
  product: Product;
  totalDiscount: number;
  totalCost: number;
  totalSum: number;
  totalSumWithoutAmount: number;
}

export class OrderWithTotalSumDto extends Order {
  orderProducts: OrderProductWithTotalSumDto[];
  totalSum: number;
  promotions: OrderDiscount[];
}
