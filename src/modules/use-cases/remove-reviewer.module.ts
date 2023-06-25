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

const useCases: Provider[] = [
  RemoveReviewerHandler,
  RemoveReviewerRequestValidator,
  RemoveReviewerProcess,
  RemoveReviewerMapper,
];

//const controllers = [V1CreateReviewerHttpController];
const providerModules = [MediatorModule, DatabaseModule, DomainServicesModule];

@Module({
  imports: [...providerModules],
  controllers: [],
  providers: [...useCases],
})
export class RemoveReviewerModule {}
