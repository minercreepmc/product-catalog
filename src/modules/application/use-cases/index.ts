import { Module } from '@nestjs/common';
import { CreateCartModule } from './create-cart.module';
import { CreateCategoryModule } from './create-category.module';
import { CreateDiscountModule } from './create-discount.module';
import { CreateOrderModule } from './create-order.module';
import { CreateProductModule } from './create-product.module';
import { EventHandlerModule } from './event-handler.module';
import { LogInAdminModule } from './log-in-admin.module';
import { LogInModule } from './log-in.module';
import {
  CartQueryModule,
  CategoryQueryModule,
  ProductQueryModule,
  UserQueryModule,
} from './query';
import { RegisterAdminModule } from './register-admin.module';
import { RegisterMemberModule } from './register-member.module';
import { RemoveCategoriesModule } from './remove-categories.module';
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
    ProductQueryModule,
    CategoryQueryModule,
    RegisterMemberModule,
    RegisterAdminModule,
    UserQueryModule,
    CartQueryModule,
    CreateOrderModule,
    UpdateOrderModule,
    EventHandlerModule,
    LogInModule,
    LogInAdminModule,
    UploadModule,
  ],
})
export class UseCaseModule {}
