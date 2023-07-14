import { V1DetachSubCategoriesHttpController } from '@controllers/http/v1/detach-sub-categories';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import { DetachSubCategoriesHandler } from '@use-cases/command/detach-sub-categories';
import {
  DetachSubCategoriesMapper,
  DetachSubCategoriesProcess,
  DetachSubCategoriesRequestValidator,
} from '@use-cases/command/detach-sub-categories/application-serivces';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const commandHandler: Provider[] = [
  DetachSubCategoriesHandler,
  DetachSubCategoriesMapper,
  DetachSubCategoriesRequestValidator,
  DetachSubCategoriesProcess,
];

const controllers = [V1DetachSubCategoriesHttpController];

const sharedModules = [
  DatabaseModule,
  ApplicationServicesModule,
  DomainServicesModule,
  MediatorModule,
];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class DetachSubCategoriesModule {}
