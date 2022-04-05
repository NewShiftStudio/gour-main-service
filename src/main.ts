import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const builder = new DocumentBuilder()
    .addServer(process.env.SERVER_PATH)
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .setBasePath('v1');

  if (process.env.NODE_ENV === 'develop') {
    builder.addServer(`http://127.0.0.1:${process.env.PORT}`);
  }

  const config = builder.build();

  console.log('NODE_ENV', process.env.NODE_ENV);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT).then(() => {
    console.log('APP LISTEN ' + process.env.PORT);
  });
}
bootstrap();
