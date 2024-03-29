import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { getRequiredEnvsByNodeEnv } from './common/utils/getRequiredEnvsByNodeEnv';
import { NodeEnv } from './common/types/App';

const envs = [
  'NODE_ENV',
  'MESSAGES_SERVICE_PORT',
  'MESSAGES_SERVICE_HOST',
  'PAYMENT_SERVICE_PORT',
  'PAYMENT_SERVICE_HOST',
  'WAREHOUSE_API_URL',
  'WAREHOUSE_LOGIN',
  'WAREHOUSE_PASSWORD',
  'WAREHOUSE_ORGANIZATION_ID',
  'SIGNATURE_SECRET',
  'REJECT_REDIRECT_URL_PAY',
  'SUCCESS_REDIRECT_URL_PAY',
];

const requiredEnvs = getRequiredEnvsByNodeEnv(
  { common: envs, development: ['SENTRY_DSN'], production: ['SENTRY_DSN'] },
  process.env.NODE_ENV as NodeEnv,
);

requiredEnvs.forEach((envKey) => {
  if (!process.env[envKey]) {
    throw new Error(`Added ${envKey} to .env file !!`);
  }
});

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: +process.env.PORT,
        host: process.env.HOST,
      },
    },
  );

  // const app = await NestFactory.create(AppModule);

  if (['production', 'development'].includes(process.env.NODE_ENV)) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  // await app.listen(5002);
  console.log('MAIN SERVICE LISTEN: ' + process.env.PORT);
}

bootstrap();
