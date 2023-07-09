import { Module } from '@nestjs/common';
import { AddParentCategoryModule } from './add-parent-category.module';
import { AddSubCategoryModule } from './add-sub-category.module';
import { ApproveProductModule } from './approve-product.module';
import { CreateCategoryModule } from './create-category.module';
import { CreateProductModule } from './create-product.module';
import { CreateReviewerModule } from './create-reviewer.module';
import { CreateReviewerSagaModule } from './create-reviewer.saga.module';
import { GetCategoriesModule } from './get-categories.module';
import { GetProductsModule } from './get-products.module';
import { RejectProductModule } from './reject-product.module';
import { RemoveCategoriesModule } from './remove-categories.module';
import { RemoveProductsModule } from './remove-products.module';
import { RemoveReviewerModule } from './remove-reviewer.module';
import { SubmitForApprovalModule } from './submit-for-approval.module';
import { UpdateProductModule } from './update-product.module';
import { UploadModule } from './upload.module';

@Module({
  imports: [
    CreateProductModule,
    UpdateProductModule,
    CreateReviewerModule,
    CreateReviewerSagaModule,
    RemoveReviewerModule,
    SubmitForApprovalModule,
    ApproveProductModule,
    RejectProductModule,
    CreateCategoryModule,
    AddSubCategoryModule,
    AddParentCategoryModule,
    GetProductsModule,
    GetCategoriesModule,
    RemoveProductsModule,
    RemoveCategoriesModule,
    UploadModule,
  ],
})
export class UseCaseModule {}
