import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, //strip any properties that do not have any decorators
    forbidNonWhitelisted:true, //throw error if non-whitelisted properties are present
  }))

  app.enableCors({
    origin:"http://localhost:3000"
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
