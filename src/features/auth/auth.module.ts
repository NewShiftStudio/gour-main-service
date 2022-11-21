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
import { City } from '../../entity/City';
import { ClientRole } from '../../entity/ClientRole';
import { WalletService } from '../wallet/wallet.service';
import { WalletModule } from '../wallet/wallet.module';

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
    forwardRef(() => WalletModule),
    HttpModule,
  ],
  controllers: [AuthController, CurrentUserController],
  providers: [AuthService, CurrentUserService],
  exports: [AuthService],
})
export class AuthModule {}
