import { swaggerOption } from '@config/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

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
    }),
  );
  app.enableCors();

  //const rmqService = app.get<RmqService>(RmqService);
  //app.connectMicroservice(rmqService.getOptions());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
}

bootstrap();
