import { V1RemoveCategoriesHttpController } from '@controllers/http/v1/remove-categories';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import { RemoveCategoriesHandler } from '@use-cases/command/remove-categories';
import {
  RemoveCategoriesMapper,
  RemoveCategoriesProcess,
  RemoveCategoriesRequestValidator,
} from '@use-cases/command/remove-categories/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const commandHandler: Provider[] = [
  RemoveCategoriesHandler,
  RemoveCategoriesMapper,
  RemoveCategoriesRequestValidator,
  RemoveCategoriesProcess,
];

const controllers = [V1RemoveCategoriesHttpController];

const sharedModules = [
  DatabaseModule,
  DomainServicesModule,
  ApplicationServicesModule,
  MediatorModule,
];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class RemoveCategoriesModule {}
