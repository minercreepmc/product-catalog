import { V1RemoveProductsHttpController } from '@controllers/http/v1/remove-products';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import { RemoveProductsHandler } from '@use-cases/command/remove-products';
import {
  RemoveProductsMapper,
  RemoveProductsProcess,
  RemoveProductsRequestValidator,
} from '@use-cases/command/remove-products/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const useCase: Provider[] = [
  RemoveProductsHandler,
  RemoveProductsRequestValidator,
  RemoveProductsMapper,
  RemoveProductsProcess,
];

const controllers = [V1RemoveProductsHttpController];

const sharedModules = [
  MediatorModule,
  DatabaseModule,
  DomainServicesModule,
  ApplicationServicesModule,
];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...useCase],
})
export class RemoveProductsModule {}
