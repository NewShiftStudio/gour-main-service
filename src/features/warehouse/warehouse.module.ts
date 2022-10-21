import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { MoyskladService } from './moysklad.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.WAREHOUSE_API_URL,
    }),
  ],
  providers: [WarehouseService, MoyskladService],
  controllers: [WarehouseController],
  exports: [WarehouseService],
})
export class WarehouseModule {}
