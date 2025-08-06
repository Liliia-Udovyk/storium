import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as path from 'path';

import { AppModule } from './app.module';
import { createSwagger } from './services/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({ origin: frontendUrl, credentials: true });

  createSwagger(app);

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const port = process.env.APP_PORT || 4000;
  await app.listen(+port);
  console.log(`Server listening on port ${port}`);
}
bootstrap();
