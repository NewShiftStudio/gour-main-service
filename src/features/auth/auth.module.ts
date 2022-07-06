import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../../entity/Client';
import { ClientModule } from '../client/client.module';
import { ReferralCode } from '../../entity/ReferralCode';
import { CurrentUserController } from './current-user.controller';
import { CurrentUserService } from './current-user.service';
import { OrderProfile } from '../../entity/OrderProfile';
import { Image } from '../../entity/Image';
import { CookieService } from './cookie.service';
import { SmsSenderService } from '../sms-sender/sms-sender.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ReferralCode, OrderProfile, Image]),
    forwardRef(() => ClientModule),
    HttpModule,
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService, CurrentUserService, CookieService, SmsSenderService],
  exports: [AuthService],
})
export class AuthModule {}
