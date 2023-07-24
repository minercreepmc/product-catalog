import { Module } from '@nestjs/common';
import { CreateCategoryModule } from './create-category.module';
import { CreateDiscountModule } from './create-discount.module';
import { CreateProductModule } from './create-product.module';
import { CategoryQueryModule, ProductQueryModule } from './query';
import { RemoveCategoriesModule } from './remove-categories.module';
import { RemoveDiscountsModule } from './remove-discounts.module';
import { RemoveProductsModule } from './remove-products.module';
import { UpdateDiscountModule } from './update-discount.module';
import { UpdateProductModule } from './update-product.module';
import { UploadModule } from './upload.module';

@Module({
  imports: [
    CreateProductModule,
    UpdateProductModule,
    CreateCategoryModule,
    CreateDiscountModule,
    UpdateDiscountModule,
    RemoveDiscountsModule,
    RemoveProductsModule,
    RemoveCategoriesModule,
    ProductQueryModule,
    CategoryQueryModule,
    UploadModule,
  ],
})
export class UseCaseModule {}
