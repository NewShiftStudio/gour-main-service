import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Client } from '../../entity/Client';
import { ClientModule } from '../client/client.module';
import { ReferralCode } from '../../entity/ReferralCode';
import { CurrentUserController } from './current-user.controller';
import { CurrentUserService } from './current-user.service';
import { OrderProfile } from '../../entity/OrderProfile';
import { Image } from '../../entity/Image';
import { CookieService } from './cookie.service';
import { City } from '../../entity/City';
import { ClientRole } from '../../entity/ClientRole';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MESSAGES_SERVICE_HOST,
          port: +process.env.MESSAGES_SERVICE_PORT,
        },
      },
    ]),
    TypeOrmModule.forFeature([
      Client,
      ReferralCode,
      OrderProfile,
      Image,
      City,
      ClientRole,
    ]),
    forwardRef(() => ClientModule),
    HttpModule,
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService, CurrentUserService, CookieService],
  exports: [AuthService],
})
export class AuthModule {}
