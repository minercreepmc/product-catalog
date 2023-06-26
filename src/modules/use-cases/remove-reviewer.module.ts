import { Module, Provider } from '@nestjs/common';
import { RemoveReviewerHandler } from '@use-cases/remove-reviewer';
import {
  RemoveReviewerMapper,
  RemoveReviewerProcess,
  RemoveReviewerRequestValidator,
} from '@use-cases/remove-reviewer/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DomainServicesModule } from '../domains';
import { DatabaseModule } from '../infrastructures/database';
import { ApplicationServicesModule } from './application-services';

const useCases: Provider[] = [
  RemoveReviewerHandler,
  RemoveReviewerRequestValidator,
  RemoveReviewerProcess,
  RemoveReviewerMapper,
];

//const controllers = [V1CreateReviewerHttpController];
const sharedModules = [
  MediatorModule,
  DatabaseModule,
  DomainServicesModule,
  ApplicationServicesModule,
];

@Module({
  imports: [...sharedModules],
  controllers: [],
  providers: [...useCases],
})
export class RemoveReviewerModule {}
