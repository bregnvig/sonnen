/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import 'source-map-support/register';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  installErrorHandler();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${ port }/${ globalPrefix }`,
  );
}

const installErrorHandler = () => {
  // Fanger fejl i Promises, der ikke er håndteret (f.eks. Firestore-crashet)
  process.on('unhandledRejection', (reason: any) => {
    Logger.warn(`Unhandled Rejection: ${ reason?.stack || reason }`);
    // Her logger den fejlen, før appen potentielt genstarter
  });

  // Fanger fejl i selve koden, der ikke er fanget af en try-catch
  process.on('uncaughtException', (err) => {
    Logger.warn(`Uncaught Exception: ${ err.stack }`);
    process.exit(1); // Luk pænt ned så PM2/Docker kan genstarte den
  });
};

bootstrap();
