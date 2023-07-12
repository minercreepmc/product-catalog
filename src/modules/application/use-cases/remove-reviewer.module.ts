import { V1RemoveReviewerHttpController } from '@controllers/http/v1/remove-reviewer';
import { V1RemoveReviewerRmqMessageHandler } from '@message-handlers/rmq/v1';
import { DomainServicesModule } from '@modules/domains';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import {
  RemoveReviewerHandler,
  RemoveReviewerMapper,
  RemoveReviewerProcess,
  RemoveReviewerRequestValidator,
} from '@use-cases/command/remove-reviewer';
import { MediatorModule } from 'nestjs-mediator';
import { ApplicationServicesModule } from './application-services';

const useCases: Provider[] = [
  RemoveReviewerHandler,
  RemoveReviewerRequestValidator,
  RemoveReviewerProcess,
  RemoveReviewerMapper,
];

const controllers = [V1RemoveReviewerHttpController];
const messageHandlers = [V1RemoveReviewerRmqMessageHandler];
const sharedModules = [
  MediatorModule,
  DatabaseModule,
  DomainServicesModule,
  ApplicationServicesModule,
];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers, ...messageHandlers],
  providers: [...useCases],
  exports: [RemoveReviewerHandler],
})
export class RemoveReviewerModule {}
