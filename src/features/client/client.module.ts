import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientController } from './client.controller';
import { ClientsService } from './client.service';
import { ClientRole } from '../../entity/ClientRole';
import { Product } from '../../entity/Product';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientRole, Product]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ClientController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientModule {}
