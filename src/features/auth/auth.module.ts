import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), ClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
