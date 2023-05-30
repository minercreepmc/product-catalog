import { swaggerOption } from '@config/swagger';
import { typeormDataSource } from '@config/typeorm';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = SwaggerModule.createDocument(app, swaggerOption);
  SwaggerModule.setup('docs', app, document);

  const swaggerSpecPath = path.join(
    process.cwd(),
    'config/swagger/swagger.json',
  );
  fs.writeFileSync(swaggerSpecPath, JSON.stringify(document));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );

  await typeormDataSource.initialize();
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
