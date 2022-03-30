import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientController } from './client.controller';
import { ClientsService } from './client.service';
import { ClientRole } from '../../entity/ClientRole';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ClientRole])],
  controllers: [ClientController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientModule {}
