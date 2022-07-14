import { Module } from '@nestjs/common';
import { ClientRoleService } from './client-role.service';
import { ClientRoleController } from './client-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRole } from '../../entity/ClientRole';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRole])],
  providers: [ClientRoleService],
  controllers: [ClientRoleController],
})
export class ClientRoleModule {}
