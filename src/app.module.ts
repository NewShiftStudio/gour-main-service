import { Module } from '@nestjs/common';
import { ClientModule } from './features/client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entity/Client';
import { ClientRole } from './entity/ClientRole';
import { ConfigModule } from '@nestjs/config';
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
import { ClientRoleModule } from './features/clientRole/clientRole.module';
import { CityModule } from './features/city/city.module';
import { ProductModule } from './features/product/product.module';
import { PromotionModule } from './features/promotion/promotion.module';
import { PageModule } from './features/page/page.module';
import { Page } from './entity/Page';

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

    // TestModule,
  ],
})
export class AppModule {}
