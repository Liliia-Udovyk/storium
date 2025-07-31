// import './utils/crypto.polyfill';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { createSwagger } from './services/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({ origin: frontendUrl, credentials: true });

  createSwagger(app);

  const port = process.env.APP_PORT || 4000;
  await app.listen(+port);
  console.log(`Server listening on port ${port}`);
}
bootstrap();
