import { CreateReviewerHttpController } from '@controllers/http';
import {
  ReviewerTypeOrmModel,
  ReviewerTypeOrmRepository,
} from '@database/repositories/typeorm/reviewer';
import { reviewerRepositoryDiToken } from '@domain-interfaces';
import { ReviewerManagementDomainService } from '@domain-services';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerMapper,
  CreateReviewerProcess,
  CreateReviewerValidator,
} from '@use-cases/create-reviewer/application-services';

const repositories: Provider[] = [
  {
    provide: reviewerRepositoryDiToken,
    useClass: ReviewerTypeOrmRepository,
  },
];

const domainServices: Provider[] = [ReviewerManagementDomainService];
const useCases: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerValidator,
  CreateReviewerProcess,
  CreateReviewerMapper,
];

const controllers = [CreateReviewerHttpController];

const vendors = [TypeOrmModule.forFeature([ReviewerTypeOrmModel]), CqrsModule];

@Module({
  imports: [...vendors],
  controllers,
  providers: [...domainServices, ...repositories, ...useCases],
})
export class CreateReviewerModule {}
