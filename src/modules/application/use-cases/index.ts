import { Module } from '@nestjs/common';
import { CreateCategoryModule } from './create-category.module';
import { CreateDiscountModule } from './create-discount.module';
import { CreateProductModule } from './create-product.module';
import { GetCategoriesModule } from './get-categories.module';
import { GetCategoryModule } from './get-category.module';
import { GetProductsModule } from './get-products.module';
import { RemoveCategoriesModule } from './remove-categories.module';
import { RemoveProductsModule } from './remove-products.module';
import { UpdateProductModule } from './update-product.module';
import { UploadModule } from './upload.module';

@Module({
  imports: [
    CreateProductModule,
    UpdateProductModule,
    GetProductsModule,
    CreateCategoryModule,
    CreateDiscountModule,
    GetCategoriesModule,
    GetCategoryModule,
    RemoveProductsModule,
    RemoveCategoriesModule,
    UploadModule,
  ],
})
export class UseCaseModule {}
