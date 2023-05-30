import { UpdateProductHttpController } from '@controllers/http';
import {
  ProductTypeOrmModel,
  ProductTypeOrmRepository,
} from '@database/repositories/typeorm/product';
import { productRepositoryDiToken } from '@domain-interfaces';
import { ProductManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateProductHandler } from '@use-cases/update-product';
import {
  UpdateProductMapper,
  UpdateProductProcess,
  UpdateProductValidator,
} from '@use-cases/update-product/application-services';

const repositories: Provider[] = [
  {
    provide: productRepositoryDiToken,
    useClass: ProductTypeOrmRepository,
  },
];

const domainServices: Provider[] = [ProductManagementDomainService];

const useCases: Provider[] = [
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductValidator,
  UpdateProductProcess,
];

const controllers = [UpdateProductHttpController];
const vendors = [TypeOrmModule.forFeature([ProductTypeOrmModel]), CqrsModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...repositories, ...domainServices, ...useCases],
})
export class UpdateProductModule {}
