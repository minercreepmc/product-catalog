import { swaggerOption } from '@config/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { RmqService } from './modules/infrastructures/ipc/rmb';

async function bootstrap() {
  // Create the NestJS app instance
  const app = await NestFactory.create(AppModule);

  // Set up Swagger documentation
  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('docs', app, document);
  //const swaggerSpecPath = path.join(
  //  process.cwd(),
  // 'config/swagger/swagger.json',
  //);
  //fs.writeFileSync(swaggerSpecPath, JSON.stringify(document));

  // Configure global pipes and enable CORS
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
  app.enableCors();

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port);
  await app.startAllMicroservices();
}

bootstrap();
