import { DatabaseModule } from '@database/di';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AddParentCategoryModule,
  AddSubCategoryModule,
  ApproveProductModule,
  CreateCategoryModule,
  CreateProductModule,
  CreateReviewerModule,
  RejectProductModule,
  SubmitForApprovalModule,
  UpdateProductModule,
} from './modules/use-cases';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    CreateProductModule,
    UpdateProductModule,
    CreateReviewerModule,
    SubmitForApprovalModule,
    ApproveProductModule,
    RejectProductModule,
    CreateCategoryModule,
    AddSubCategoryModule,
    AddParentCategoryModule,
  ],
})
export class AppModule {}
