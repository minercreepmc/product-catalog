import { V1CreateReviewerHttpController } from '@controllers/http/v1';
import { V1CreateReviewerRmqMessageHandler } from '@message-handlers/rmq/v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerMapper,
  CreateReviewerProcess,
  CreateReviewerRequestValidator,
} from '@use-cases/create-reviewer/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DomainServicesModule } from '../domains';
import { DatabaseModule } from '../infrastructures/database';
import { ApplicationServicesModule } from './application-services';

const useCase: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerRequestValidator,
  CreateReviewerProcess,
  CreateReviewerMapper,
];

const controllers = [V1CreateReviewerHttpController];
const messageHandlers = [V1CreateReviewerRmqMessageHandler];
const providerModules = [
  MediatorModule,
  CqrsModule,
  DatabaseModule,
  DomainServicesModule,
  ApplicationServicesModule,
];

@Module({
  imports: [...providerModules],
  controllers: [...controllers, ...messageHandlers],
  providers: [...useCase],
  exports: [CreateReviewerHandler],
})
export class CreateReviewerModule {}
