import { Module } from '@nestjs/common';
import { AddressModule } from './address.module';
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
  DiscountQueryModule,
  OrderQueryModule,
  ProductQueryModule,
  UserQueryModule,
} from './query';
import { RegisterAdminModule } from './register-admin.module';
import { RegisterMemberModule } from './register-member.module';
import { RemoveCategoriesModule } from './remove-categories.module';
import { RemoveCategoryModule } from './remove-category.module';
import { RemoveDiscountModule } from './remove-discount.module';
import { RemoveDiscountsModule } from './remove-discounts.module';
import { RemoveProductsModule } from './remove-products.module';
import { ShippingModule } from './shipping.module';
import { UpdateCartModule } from './update-cart.module';
import { UpdateCategoryModule } from './update-category.module';
import { UpdateDiscountModule } from './update-discount.module';
import { UpdateOrderModule } from './update-order.module';
import { UpdateProductModule } from './update-product.module';
import { UpdateProfileModule } from './update-profile.module';
import { UploadModule } from './upload.module';
import { UserModule } from './user.module';

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
    RegisterMemberModule,
    RegisterAdminModule,
    UserQueryModule,
    CartQueryModule,
    CreateOrderModule,
    UpdateOrderModule,
    OrderQueryModule,
    EventHandlerModule,
    UpdateProfileModule,
    DiscountQueryModule,
    LogInModule,
    LogInAdminModule,
    UploadModule,
    AddressModule,
    ShippingModule,
    UserModule,
  ],
})
export class UseCaseModule {}
