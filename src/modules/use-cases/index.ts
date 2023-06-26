import { Module } from '@nestjs/common';
import { AddParentCategoryModule } from './add-parent-category.module';
import { AddSubCategoryModule } from './add-sub-category.module';
import { ApproveProductModule } from './approve-product.module';
import { CreateCategoryModule } from './create-category.module';
import { CreateProductModule } from './create-product.module';
import { CreateReviewerModule } from './create-reviewer.module';
import { CreateReviewerSagaModule } from './create-reviewer.saga.module';
import { RejectProductModule } from './reject-product.module';
import { SubmitForApprovalModule } from './submit-for-approval.module';
import { UpdateProductModule } from './update-product.module';

@Module({
  imports: [
    CreateProductModule,
    UpdateProductModule,
    //CreateReviewerSagaModule,
    CreateReviewerModule,
    SubmitForApprovalModule,
    ApproveProductModule,
    RejectProductModule,
    CreateCategoryModule,
    AddSubCategoryModule,
    AddParentCategoryModule,
  ],
})
export class UseCaseModule {}
