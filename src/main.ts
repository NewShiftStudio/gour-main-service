import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

// ТЕМА УДАЛИ ПОЖАЛУЙСТА ЭТИ ДАННЕЫЕ ПЛИЗКИ СОСИСКИ
if (!process.env.KAFKA_PASSWORD || !process.env.KAFKA_USERNAME) {
  throw new Error('Added KAFKA_PASSWORD and KAFKA_USERNAME to .env file!!');
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: 5112,
      },
      // options: {
      //   client: {
      //     clientId: 'main',
      //     brokers: ['localhost:9092'],
      //     ssl: process.env.NODE_END === 'production',
      //     sasl: {
      //       mechanism: 'plain',
      //       username: process.env.KAFKA_USERNAME,
      //       password: process.env.KAFKA_PASSWORD,
      //     },
      //   },
      //   consumer: {
      //     groupId: 'main-consumer',
      //   },
      // },
    },
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
}

bootstrap();
