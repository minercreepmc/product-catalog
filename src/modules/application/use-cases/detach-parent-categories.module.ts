import { V1DetachParentCategoriesHttpController } from '@controllers/http/v1/detach-parent-categories';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import {
  DetachParentCategoriesMapper,
  DetachParentCategoriesProcess,
  DetachParentCategoriesRequestValidator,
} from '@use-cases/command/detach-parent-categories/application-serivces';
import { DetachParentCategoriesHandler } from '@use-cases/command/detach-parent-categories/detach-parent-categories.handler';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const commandHandler: Provider[] = [
  DetachParentCategoriesMapper,
  DetachParentCategoriesHandler,
  DetachParentCategoriesRequestValidator,
  DetachParentCategoriesProcess,
];

const controllers = [V1DetachParentCategoriesHttpController];

const sharedModules = [
  DomainServicesModule,
  ApplicationServicesModule,
  DatabaseModule,
  MediatorModule,
];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class DetachParentCategoriesModule {}
