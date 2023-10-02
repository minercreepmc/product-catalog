import { Module } from '@nestjs/common';
import { CreateCartModule } from './create-cart.module';
import { CreateCategoryModule } from './create-category.module';
import { CreateDiscountModule } from './create-discount.module';
import { CreateOrderModule } from './create-order.module';
import { CreateProductModule } from './create-product.module';
import { EventHandlerModule } from './event-handler.module';
import {
  CartQueryModule,
  CategoryQueryModule,
  DiscountQueryModule,
  OrderQueryModule,
  ProductQueryModule,
} from './query';
import { RemoveCategoriesModule } from './remove-categories.module';
import { RemoveCategoryModule } from './remove-category.module';
import { RemoveDiscountModule } from './remove-discount.module';
import { RemoveDiscountsModule } from './remove-discounts.module';
import { RemoveProductsModule } from './remove-products.module';
import { UpdateCartModule } from './update-cart.module';
import { UpdateCategoryModule } from './update-category.module';
import { UpdateDiscountModule } from './update-discount.module';
import { UpdateOrderModule } from './update-order.module';
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
    CreateCartModule,
    UpdateCartModule,
    RemoveProductsModule,
    UpdateCategoryModule,
    RemoveCategoriesModule,
    RemoveCategoryModule,
    RemoveDiscountModule,
    ProductQueryModule,
    CategoryQueryModule,
    CartQueryModule,
    CreateOrderModule,
    UpdateOrderModule,
    OrderQueryModule,
    EventHandlerModule,
    DiscountQueryModule,
    UploadModule,
  ],
})
export class UseCaseModule {}
