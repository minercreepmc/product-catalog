import { V1UpdateProductHttpController } from '@controllers/http/v1';
import { ProductManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateProductHandler } from '@use-cases/update-product';
import {
  UpdateProductMapper,
  UpdateProductProcess,
  UpdateProductValidator,
} from '@use-cases/update-product/application-services';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [ProductManagementDomainService];

const useCases: Provider[] = [
  UpdateProductHandler,
  UpdateProductMapper,
  UpdateProductValidator,
  UpdateProductProcess,
];

const controllers = [V1UpdateProductHttpController];

const vendors = [CqrsModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...useCases],
})
export class UpdateProductModule {}
