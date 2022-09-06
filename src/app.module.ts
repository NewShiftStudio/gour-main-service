import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { ClientModule } from './features/client/client.module';
import { Client } from './entity/Client';
import { ClientRole } from './entity/ClientRole';
import { Product } from './entity/Product';
import { Category } from './entity/Category';
import { City } from './entity/City';
import { Image } from './entity/Image';
import { Order } from './entity/Order';
import { OrderProduct } from './entity/OrderProduct';
import { OrderProfile } from './entity/OrderProfile';
import { PageMeta } from './entity/PageMeta';
import { Price } from './entity/Price';
import { ProductGrade } from './entity/ProductGrade';
import { ProductModification } from './entity/ProductModification';
import { Promotion } from './entity/Promotion';
import { RoleDiscount } from './entity/RoleDiscount';
import { TranslatableString } from './entity/TranslatableString';
import { TranslatableText } from './entity/TranslatableText';
import { Warehouse } from './entity/Warehouse';
import { CategoryModule } from './features/category/category.module';
import { ClientRoleModule } from './features/client-role/client-role.module';
import { CityModule } from './features/city/city.module';
import { ProductModule } from './features/product/product.module';
import { PromotionModule } from './features/promotion/promotion.module';
import { PageModule } from './features/page/page.module';
import { Page } from './entity/Page';
import { AuthModule } from './features/auth/auth.module';
import { OrderModule } from './features/order/order.module';
import { OrderProfileModule } from './features/order-profile/order-profile.module';
import { ReferralCodeModule } from './features/referral-code/referral-code.module';
import { ReferralCode } from './entity/ReferralCode';
import { ImageModule } from './features/image/image.module';
import { MetaModule } from './features/meta/meta.module';
import { Meta } from './entity/Meta';
import { WalletModule } from './features/wallet/wallet.module';
import { Wallet } from './entity/Wallet';
import { WalletTransaction } from './entity/WalletTransaction';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SentryInterceptor } from './common/interceptors/sentry.interceptor';

const requiredEnvs = ['PORT', 'MESSAGES_SERVICE_PORT', 'MESSAGES_SERVICE_HOST'];

requiredEnvs.forEach((envKey) => {
  if (!process.env[envKey]) {
    throw new Error(`Added ${envKey} to .env file !!`);
  }
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      entities: [
        Client,
        ClientRole,
        Product,
        Category,
        City,
        Image,
        Order,
        OrderProduct,
        OrderProfile,
        PageMeta,
        Price,
        ProductGrade,
        ProductModification,
        Promotion,
        RoleDiscount,
        TranslatableString,
        TranslatableText,
        Warehouse,
        Page,
        ReferralCode,
        Meta,
        Wallet,
        WalletTransaction,
      ],
      subscribers: ['dist/subscriber/*.js'],
      migrations: ['dist/migration/*.js'],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
    }),
    ClientModule,
    CategoryModule,
    CityModule,
    ClientRoleModule,
    ProductModule,
    PromotionModule,
    PageModule,
    AuthModule,
    OrderModule,
    OrderProfileModule,
    ReferralCodeModule,
    ImageModule,
    MetaModule,
    WalletModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SentryInterceptor,
    },
  ],
})
export class AppModule {}
