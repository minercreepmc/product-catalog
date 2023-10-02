import { Injectable } from '@nestjs/common';
import { AddImageUrlsDto } from './dtos';
import { ProductImageRepository } from './product-image.repository';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  async addImageUrls(dto: AddImageUrlsDto) {
    return this.productImageRepository.addImageUrls(dto);
  }

  async getProductImages(productId: string) {
    return this.productImageRepository.getProductImages(productId);
  }
}
