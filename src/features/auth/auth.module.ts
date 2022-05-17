import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientModule } from '../client/client.module';
import { ReferralCode } from '../../entity/ReferralCode';
import { CurrentUserController } from './current-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ReferralCode]),
    forwardRef(() => ClientModule),
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
