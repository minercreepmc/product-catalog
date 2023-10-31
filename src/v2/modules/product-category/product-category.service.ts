import { PaginationParams } from '@constants';
import { Injectable } from '@nestjs/common';
import { ProductGetAllByCategoryDto } from './dto/product-category.dto';
import { ProductCategoryRepository } from './product-category.repository';

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
