import { V1CreateProductHttpController } from '@controllers/http/v1';
import { ProductManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductValidator,
} from '@use-cases/create-product/application-services';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [ProductManagementDomainService];

const applicationServices: Provider[] = [
  CreateProductHandler,
  CreateProductMapper,
  CreateProductValidator,
  CreateProductProcess,
];

const controllers = [V1CreateProductHttpController];
const vendors = [CqrsModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class CreateProductModule {}
