import { ApiApplication, PaginationParams } from '@constants';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ProductGetAllByCategoryDto } from './dto/product-category.dto';
import { ProductCategoryService } from './product-category.service';

@Controller(ApiApplication.PRODUCT_CATEGORY.CONTROLLER)
export class ProductCategoryController {
  constructor(private productCategoryService: ProductCategoryService) {}
  @Post(ApiApplication.PRODUCT_CATEGORY.GET_PRODUCTS_BY_CATEGORY)
  getProductsByCategory(
    @Query() query: PaginationParams,
    @Body() dto: ProductGetAllByCategoryDto,
  ) {
    return this.productCategoryService.getProductsByCategory(dto, query);
  }
}
