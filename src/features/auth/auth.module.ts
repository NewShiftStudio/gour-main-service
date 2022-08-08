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
import { HttpModule } from '@nestjs/axios';
import { City } from '../../entity/City';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ReferralCode, OrderProfile, Image, City]),
    forwardRef(() => ClientModule),
    HttpModule,
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService, CurrentUserService, CookieService],
  exports: [AuthService],
})
export class AuthModule {}
