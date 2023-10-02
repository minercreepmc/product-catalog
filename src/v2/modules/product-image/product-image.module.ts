import { Module } from '@nestjs/common';
import { ProductImageController } from './product-image.controller';
import { ProductImageRepository } from './product-image.repository';
import { ProductImageService } from './product-image.service';

@Module({
  controllers: [ProductImageController],
  providers: [ProductImageService, ProductImageRepository],
})
export class ProductImageModule {}
