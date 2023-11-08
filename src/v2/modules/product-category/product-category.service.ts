import { Injectable } from '@nestjs/common';
import type { PaginationParams } from '@constants';
import { ProductCategoryRepository } from './product-category.repository';
import type { ProductGetAllByCategoryDto } from './dto/product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(private productCategoryRepository: ProductCategoryRepository) {}
  getProductsByCategory(
    dto: ProductGetAllByCategoryDto,
    filter: PaginationParams,
  ) {
    const { categoryId } = dto;
    return this.productCategoryRepository.findProductsByCategory(
      categoryId,
      filter,
    );
  }
}
