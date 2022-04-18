import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entity/Order';
import { Product } from '../../entity/Product';
import { Client } from '../../entity/Client';
import { OrderProfile } from '../../entity/OrderProfile';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Order, Product, OrderProfile])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
