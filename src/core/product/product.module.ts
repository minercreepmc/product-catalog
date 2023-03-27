import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
} from '@product-domain/domain-services';
import { productRepositoryDiToken } from '@product-domain/interfaces';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@product-infrastructure/database/repositories/typeorm/product';
import { CreateProductHandler } from '@product-use-case/create-product';
import {
  CreateProductBusinessValidator,
  CreateProductCommandValidator,
  CreateProductMapper,
} from '@product-use-case/create-product/application-services';
import { CreateProductHttpController } from './interface-adapters/controllers/http';

// Domain
const domainServices: Provider[] = [
  ProductApprovalDomainService,
  ProductManagementDomainService,
];

// Infrastructure
const repositories: Provider[] = [
  {
    provide: productRepositoryDiToken,
    useClass: ProductTypeOrmRepository,
  },
];

// Use case
const createProductUseCase: Provider[] = [
  CreateProductHandler,
  CreateProductCommandValidator,
  CreateProductMapper,
  CreateProductBusinessValidator,
];

const useCases: Provider[] = [...createProductUseCase];

// Interface Adapters
const createProductController = [CreateProductHttpController];

const controllers = [...createProductController];

// Vendor
const vendors = [CqrsModule, TypeOrmModule.forFeature([ProductTypeOrmModel])];

@Module({
  imports: [...vendors],
  controllers: [...controllers],
  providers: [...domainServices, ...repositories, ...useCases],
})
export class ProductModule {}
