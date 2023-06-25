import { V1CreateProductHttpController } from '@controllers/http/v1';
import { ProductManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductRequestValidator,
} from '@use-cases/create-product/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [ProductManagementDomainService];

const applicationServices: Provider[] = [
  CreateProductHandler,
  CreateProductMapper,
  CreateProductRequestValidator,
  CreateProductProcess,
];

const controllers = [V1CreateProductHttpController];
const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class CreateProductModule {}
