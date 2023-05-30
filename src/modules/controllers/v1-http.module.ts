import {
  AddSubCategoriesHttpController,
  ApproveProductHttpController,
  CreateCategoryHttpController,
  CreateProductHttpController,
  CreateReviewerHttpController,
  RejectProductHttpController,
  SubmitForApprovalHttpController,
  UpdateProductHttpController,
} from '@controllers/http';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

const controllers = [
  CreateProductHttpController,
  UpdateProductHttpController,
  CreateReviewerHttpController,
  SubmitForApprovalHttpController,
  ApproveProductHttpController,
  RejectProductHttpController,
  CreateCategoryHttpController,
  AddSubCategoriesHttpController,
];

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'v1',
      },
    ]),
  ],
  controllers,
})
export class V1HttpModule {}
