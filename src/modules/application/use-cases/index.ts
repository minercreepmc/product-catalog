import { Module } from '@nestjs/common';
import { CreateProductModule } from './create-product.module';
import { LogInAdminModule } from './log-in-admin.module';
import { LogInModule } from './log-in.module';
import { ProductQueryModule, UserQueryModule } from './query';
import { RegisterAdminModule } from './register-admin.module';
import { RegisterMemberModule } from './register-member.module';
import { RemoveProductsModule } from './remove-products.module';
import { UpdateProductModule } from './update-product.module';
import { UpdateProfileModule } from './update-profile.module';
import { UploadModule } from './upload.module';

@Module({
  imports: [
    CreateProductModule,
    UpdateProductModule,
    RemoveProductsModule,
    ProductQueryModule,
    RegisterMemberModule,
    RegisterAdminModule,
    UserQueryModule,
    UpdateProfileModule,
    LogInModule,
    LogInAdminModule,
    UploadModule,
  ],
})
export class UseCaseModule {}
