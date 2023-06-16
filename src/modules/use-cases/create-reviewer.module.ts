import { V1CreateReviewerHttpController } from '@controllers/http/v1';
import { ReviewerManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerMapper,
  CreateReviewerProcess,
  CreateReviewerValidator,
} from '@use-cases/create-reviewer/application-services';
import { MediatorModule } from 'nestjs-mediator';
import { DatabaseModule } from '../infrastructures/database';

const domainServices: Provider[] = [ReviewerManagementDomainService];
const useCases: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerValidator,
  CreateReviewerProcess,
  CreateReviewerMapper,
];

const controllers = [V1CreateReviewerHttpController];
const vendors = [MediatorModule, DatabaseModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...useCases],
})
export class CreateReviewerModule {}
