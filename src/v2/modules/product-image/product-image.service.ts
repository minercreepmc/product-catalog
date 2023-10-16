import { Injectable } from '@nestjs/common';
import { AddImageUrlsDto, RemoveImageUrlDto } from './dto';
import { ProductImageRepository } from './product-image.repository';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly productImageRepository: ProductImageRepository,
  ) {}

  async addImageUrls(dto: AddImageUrlsDto) {
    return this.productImageRepository.addImageUrls(dto);
  }

  async removeImageUrls(dto: RemoveImageUrlDto) {
    return this.productImageRepository.removeImageUrl(dto);
  }

  async getProductImages(productId: string) {
    return this.productImageRepository.getProductImages(productId);
  }
}
