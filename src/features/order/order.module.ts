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
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ClientModule } from '../client/client.module';
import { WalletModule } from '../wallet/wallet.module';
import { AmoCrmService } from './amo-crm.service';
import { OrderProfileService } from '../order-profile/order-profile.service';
import { CityModule } from '../city/city.module';
import { City } from 'src/entity/City';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Client,
      Order,
      Product,
      OrderProfile,
      OrderProduct,
      City,
      Meta,
    ]),
    CityModule,
    MetaModule,
    ProductModule,
    DiscountModule,
    WarehouseModule,
    ClientModule,
    WalletModule,
  ],
  providers: [OrderService, MetaService, AmoCrmService, OrderProfileService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
