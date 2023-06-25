import { V1CreateCategoryHttpController } from '@controllers/http/v1';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryRequestValidator,
} from '@use-cases/create-category/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';
import { MediatorModule } from 'nestjs-mediator';

const domainServices: Provider[] = [
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
];

const applicationServices: Provider[] = [
  CreateCategoryHandler,
  CreateCategoryRequestValidator,
  CreateCategoryProcess,
  CreateCategoryMapper,
];

const controllers = [V1CreateCategoryHttpController];
const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class CreateCategoryModule {}
