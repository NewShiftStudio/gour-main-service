import { Module } from '@nestjs/common';
import { ClientRoleService } from './clientRole.service';
import { ClientRoleController } from './clientRole.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRole } from '../../entity/ClientRole';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRole])],
  providers: [ClientRoleService],
  controllers: [ClientRoleController],
})
export class ClientRoleModule {}
