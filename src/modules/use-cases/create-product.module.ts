import { CreateProductHttpController } from '@controllers/http';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@database/repositories/typeorm/product';
import { productRepositoryDiToken } from '@domain-interfaces';
import { ProductManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductValidator,
} from '@use-cases/create-product/application-services';

const repositories: Provider[] = [
  {
    provide: productRepositoryDiToken,
    useClass: ProductTypeOrmRepository,
  },
];

const domainServices: Provider[] = [ProductManagementDomainService];

const applicationServices: Provider[] = [
  CreateProductHandler,
  CreateProductMapper,
  CreateProductValidator,
  CreateProductProcess,
];

const controllers = [CreateProductHttpController];
const vendors = [TypeOrmModule.forFeature([ProductTypeOrmModel]), CqrsModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...repositories, ...applicationServices],
})
export class CreateProductModule {}
