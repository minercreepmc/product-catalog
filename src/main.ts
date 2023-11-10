import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints!).join(', '),
          })),
        );
      },
    }),
  );

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-API-Key'],
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
  });

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port || 4201);
}

bootstrap();
