import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOption = new DocumentBuilder()
  .setTitle('Product Catalog API')
  .setDescription('Manage your products')
  .setVersion('0.1')
  .build();
