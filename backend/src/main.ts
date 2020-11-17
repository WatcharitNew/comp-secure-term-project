import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

async function bootstrap() {
  const port = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const option:CorsOptions= {
    origin: true,
    credentials: true,
  }
  app.enableCors(option);
  await app.listen(port);
  console.log('Server is running on port: ', port);
}
bootstrap();
