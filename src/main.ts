import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create NestJS application using the root AppModule

  app.useGlobalPipes(new ValidationPipe({   // Apply global validation pipe

    whitelist:true, //strip any properties that do not have any decorators
    forbidNonWhitelisted:true, //throw error if non-whitelisted properties are present
  }))

  app.enableCors({   //Enable CORS so frontend (React, Angular, etc.) can call backend
    origin:"http://localhost:3000"
  });


  app.use(helmet()) // global middelware Help secure Express apps by setting HTTP response headers


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
