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
  CreateProductMapper,
} from '@use-cases/create-product/application-services';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerBusinessValidator,
  CreateReviewerCommandValidator,
  CreateReviewerMapper,
} from '@use-cases/create-reviewer/application-services';
import { UpdateProductHandler } from '@use-cases/update-product';
import {
  UpdateProductBusinessValidator,
  UpdateProductMapper,
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

// Application services
const applicationService: Provider[] = [ProductCommandValidator];

// Use case
const createProductUseCase: Provider[] = [
  CreateProductHandler,
  CreateProductMapper,
  CreateProductBusinessValidator,
];

const updateProductUseCase: Provider[] = [
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductBusinessValidator,
];
const createReviewerUseCase: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerCommandValidator,
  CreateReviewerBusinessValidator,
  CreateReviewerMapper,
];

const useCases: Provider[] = [
  ...createProductUseCase,
  ...updateProductUseCase,
  ...createReviewerUseCase,
];

// Interface Adapters
const createProductController = [CreateProductHttpController];
const updateProductController = [UpdateProductHttpController];
const createReviewerController = [CreateReviewerHttpController];

const controllers = [
  ...createProductController,
  ...updateProductController,
  ...createReviewerController,
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
  providers: [
    ...applicationService,
    ...domainServices,
    ...repositories,
    ...useCases,
  ],
})
export class AppModule {}
