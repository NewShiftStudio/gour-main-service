import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from '../../entity/Order';
import { Product } from '../../entity/Product';
import { Client } from '../../entity/Client';
import { OrderProfile } from '../../entity/OrderProfile';
import { OrderProduct } from '../../entity/OrderProduct';
import { MetaService } from '../meta/meta.service';
import { MetaModule } from '../meta/meta.module';
import { Meta } from '../../entity/Meta';
import { AmoCrmService } from './amo-crm.service';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Order,
      Product,
      OrderProfile,
      OrderProduct,
      Meta,
    ]),
    MetaModule,
    ProductModule,
    DiscountModule,
  ],
  providers: [OrderService, AmoCrmService, MetaService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
