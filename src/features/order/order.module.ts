import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  providers: [OrderService, AmoCrmService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
