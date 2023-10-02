import { swaggerOption } from '@config/swagger';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';

async function bootstrap() {
  // Create the NestJS app instance
  const app = await NestFactory.create(AppModule);

  // Set up Swagger documentation
  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('docs', app, document);

  // Configure global pipes and enable CORS
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      forbidNonWhitelisted: true,
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
  });

  app.use(cookieParser());

  //const rmqService = app.get<RmqService>(RmqService);
  //app.connectMicroservice(rmqService.getOptions());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port || 4201);
}

bootstrap();
