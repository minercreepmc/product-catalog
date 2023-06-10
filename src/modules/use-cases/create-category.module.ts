import { V1CreateCategoryHttpController } from '@controllers/http/v1';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCategoryHandler } from '@use-cases/create-category';
import {
  CreateCategoryMapper,
  CreateCategoryProcess,
  CreateCategoryValidator,
} from '@use-cases/create-category/application-services';
import { DatabaseModule } from '@modules/infrastructures/database';

const domainServices: Provider[] = [
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
];

const applicationServices: Provider[] = [
  CreateCategoryHandler,
  CreateCategoryValidator,
  CreateCategoryProcess,
  CreateCategoryMapper,
];

const controllers = [V1CreateCategoryHttpController];
const vendors = [CqrsModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...applicationServices],
})
export class CreateCategoryModule {}