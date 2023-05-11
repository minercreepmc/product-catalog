import { ApproveProductHttpController } from '@controllers/http/approve-product';
import { CreateCategoryHttpController } from '@controllers/http/create-category';
import { RejectProductHttpController } from '@controllers/http/reject-product';
import { SubmitForApprovalHttpController } from '@controllers/http/submit-for-approval';
import { DatabaseModule } from '@database/di';
import {
  CategoryTypeOrmModel,
  CategoryTypeOrmRepository,
} from '@database/repositories/typeorm/category';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@database/repositories/typeorm/product';
import {
  ReviewerTypeOrmModel,
  ReviewerTypeOrmRepository,
} from '@database/repositories/typeorm/reviewer';
import {
  categoryRepositoryDiToken,
  productRepositoryDiToken,
  reviewerRepositoryDiToken,
} from '@domain-interfaces';
import {
  CategoryManagementDomainService,
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApproveProductHandler } from '@use-cases/approve-product';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from '@use-cases/approve-product/application-services';
import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryValidator,
} from '@use-cases/create-category/application-services';
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
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductValidator,
} from '@use-cases/reject-product/application-services';
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
  CategoryManagementDomainService,
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
  {
    provide: categoryRepositoryDiToken,
    useClass: CategoryTypeOrmRepository,
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
const approveProductUseCase: Provider[] = [
  ApproveProductHandler,
  ApproveProductValidator,
  ApproveProductProcess,
  ApproveProductMapper,
];
const rejectProductUseCase: Provider[] = [
  RejectProductHandler,
  RejectProductValidator,
  RejectProductProcess,
  RejectProductMapper,
];
const createCategoryUseCase: Provider[] = [
  CreateCategoryHandler,
  CreateCategoryValidator,
  CreateCategoryProcess,
  CreateCategoryMapper,
];

const useCases: Provider[] = [
  ...createProductUseCase,
  ...updateProductUseCase,
  ...createReviewerUseCase,
  ...submitForApprovalUseCase,
  ...approveProductUseCase,
  ...rejectProductUseCase,
  ...createCategoryUseCase,
];

// Interface Adapters
const createProductController = [CreateProductHttpController];
const updateProductController = [UpdateProductHttpController];
const createReviewerController = [CreateReviewerHttpController];
const submitForApprovalController = [SubmitForApprovalHttpController];
const approveProductController = [ApproveProductHttpController];
const rejectProductController = [RejectProductHttpController];
const createCategoryController = [CreateCategoryHttpController];
//
const controllers = [
  ...createProductController,
  ...updateProductController,
  ...createReviewerController,
  ...submitForApprovalController,
  ...approveProductController,
  ...rejectProductController,
  ...createCategoryController,
];

// Vendor
const vendors = [
  CqrsModule,
  TypeOrmModule.forFeature([
    ProductTypeOrmModel,
    ReviewerTypeOrmModel,
    CategoryTypeOrmModel,
  ]),
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
