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
import { ProductCommandValidator } from '@use-cases/application-services/command-validators';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductBusinessValidator,
  CreateProductCommandValidator,
  CreateProductMapper,
} from '@use-cases/create-product/application-services';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerBusinessValidator,
  CreateReviewerCommandValidator,
  CreateReviewerMapper,
} from '@use-cases/create-reviewer/application-services';
import {
  SubmitForApprovalBusinessValidator,
  SubmitForApprovalCommandValidator,
  SubmitForApprovalMapper,
} from '@use-cases/submit-for-approval/application-services';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval/submit-for-approval.handler';
import { UpdateProductHandler } from '@use-cases/update-product';
import {
  UpdateProductBusinessValidator,
  UpdateProductCommandValidator,
  UpdateProductMapper,
} from '@use-cases/update-product/application-services';
import {
  CreateProductHttpController,
  CreateReviewerHttpController,
  UpdateProductHttpController,
} from './interface-adapters/controllers/http';
import { SubmitForApprovalHttpController } from './interface-adapters/controllers/http/submit-for-approval';

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
  CreateProductCommandValidator,
  CreateProductBusinessValidator,
];

const updateProductUseCase: Provider[] = [
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductCommandValidator,
  UpdateProductBusinessValidator,
];
const createReviewerUseCase: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerCommandValidator,
  CreateReviewerBusinessValidator,
  CreateReviewerMapper,
];
const submitForApprovalUseCase: Provider[] = [
  SubmitForApprovalHandler,
  SubmitForApprovalCommandValidator,
  SubmitForApprovalBusinessValidator,
  SubmitForApprovalMapper,
];

const useCases: Provider[] = [
  ...createProductUseCase,
  ...updateProductUseCase,
  ...createReviewerUseCase,
  ...submitForApprovalUseCase,
];

// Interface Adapters
const createProductController = [CreateProductHttpController];
const updateProductController = [UpdateProductHttpController];
const createReviewerController = [CreateReviewerHttpController];
const submitForApprovalController = [SubmitForApprovalHttpController];

const controllers = [
  ...createProductController,
  ...updateProductController,
  ...createReviewerController,
  ...submitForApprovalController,
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
