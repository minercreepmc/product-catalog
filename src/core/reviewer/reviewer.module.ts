import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewerManagementDomainService } from '@reviewer-domain/domain-services';
import { reviewerRepositoryDiToken } from '@reviewer-domain/interfaces';
import {
  ReviewerTypeOrmModel,
  ReviewerTypeOrmRepository,
} from '@reviewer-infrastructure/database/repositories/typeorm';
import { CreateReviewerHandler } from '@reviewer-use-case/create-reviewer';
import {
  CreateReviewerBusinessValidator,
  CreateReviewerCommandValidator,
  CreateReviewerMapper,
} from '@reviewer-use-case/create-reviewer/application-services';
import { CreateReviewerHttpController } from './interface-adapters/controllers/http/create-reviewer';

// Domain
const domainServices: Provider[] = [
  ReviewerManagementDomainService
];

// Infrastructure
const repositories: Provider[] = [
  {
    provide: reviewerRepositoryDiToken,
    useClass: ReviewerTypeOrmRepository,
  },
];

// Use case
const createReviewerUseCase: Provider[] = [
  CreateReviewerHandler,
  CreateReviewerCommandValidator,
  CreateReviewerBusinessValidator,
  CreateReviewerMapper,
];

const useCases: Provider[] = [...createReviewerUseCase];

// Interface Adapters
const createReviewerController = [CreateReviewerHttpController];

const controllers = [...createReviewerController];

// Vendor
const vendors = [CqrsModule, TypeOrmModule.forFeature([ReviewerTypeOrmModel])];

@Module({
  imports: [...vendors],
  controllers: [...controllers],
  providers: [...domainServices, ...repositories, ...useCases],
})
export class ReviewerModule {}
