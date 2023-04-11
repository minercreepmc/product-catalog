import { SubmitForApprovalHttpController } from '@controllers/http/submit-for-approval';
import { DatabaseModule } from '@database/di';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@database/repositories/typeorm/product';
import {
  ReviewerTypeOrmModel,
  ReviewerTypeOrmRepository,
} from '@database/repositories/typeorm/reviewer';
import {
  productRepositoryDiToken,
  reviewerRepositoryDiToken,
} from '@domain-interfaces';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductProcess,
  CreateProductValidator,
  CreateProductMapper,
} from '@use-cases/create-product/application-services';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerMapper,
  CreateReviewerProcess,
  CreateReviewerValidator,
} from '@use-cases/create-reviewer/application-services';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval';
import {
  SubmitForApprovalMapper,
  SubmitForApprovalProcess,
  SubmitForApprovalValidator,
} from '@use-cases/submit-for-approval/application-services';
import { UpdateProductHandler } from '@use-cases/update-product';
import {
  UpdateProductMapper,
  UpdateProductProcess,
  UpdateProductValidator,
} from '@use-cases/update-product/application-services';
import {
  CreateProductHttpController,
  CreateReviewerHttpController,
  UpdateProductHttpController,
} from './interface-adapters/controllers/http';

// Domain
const domainServices: Provider[] = [
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
];

// Infrastructure
const repositories: Provider[] = [
  {
    provide: productRepositoryDiToken,
    useClass: ProductTypeOrmRepository,
  },
  {
    provide: reviewerRepositoryDiToken,
    useClass: ReviewerTypeOrmRepository,
  },
];

// Use case
const createProductUseCase: Provider[] = [
  CreateProductHandler,
  CreateProductMapper,
  CreateProductValidator,
  CreateProductProcess,
];

const updateProductUseCase: Provider[] = [
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductValidator,
  UpdateProductProcess,
];
const createReviewerUseCase: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerValidator,
  CreateReviewerProcess,
  CreateReviewerMapper,
];
const submitForApprovalUseCase: Provider[] = [
  SubmitForApprovalHandler,
  SubmitForApprovalValidator,
  SubmitForApprovalProcess,
  SubmitForApprovalMapper,
];
// const approveProductUseCase: Provider[] = [
//   ApproveProductHandler,
//   ApproveProductCommandValidator,
//   ApproveProductProcessValidator,
//   ApproveProductMapper,
// ];

const useCases: Provider[] = [
  ...createProductUseCase,
  ...updateProductUseCase,
  ...createReviewerUseCase,
  ...submitForApprovalUseCase,
  // ...approveProductUseCase,
];

// Interface Adapters
const createProductController = [CreateProductHttpController];
const updateProductController = [UpdateProductHttpController];
const createReviewerController = [CreateReviewerHttpController];
const submitForApprovalController = [SubmitForApprovalHttpController];
// const approveProductController = [ApproveProductHttpController];
//
const controllers = [
  ...createProductController,
  ...updateProductController,
  ...createReviewerController,
  ...submitForApprovalController,
  // ...approveProductController,
];

// Vendor
const vendors = [
  CqrsModule,
  TypeOrmModule.forFeature([ProductTypeOrmModel, ReviewerTypeOrmModel]),
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ...vendors,
  ],
  controllers,
  providers: [...domainServices, ...repositories, ...useCases],
})
export class AppModule {}
