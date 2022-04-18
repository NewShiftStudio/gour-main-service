import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientController } from './client.controller';
import { ClientsService } from './client.service';
import { ClientRole } from '../../entity/ClientRole';
import { Product } from '../../entity/Product';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ClientRole, Product])],
  controllers: [ClientController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientModule {}
