import {
  CreateReviewerAggregateOptions,
  ReviewerAggregate,
} from '@aggregates/reviewer';
import { RemoveReviewerCommand } from '@commands';
import {
  ReviewerCreatedDomainEvent,
  ReviewerRemovedDomainEvent,
} from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  reviewerRepositoryDiToken,
  ReviewerRepositoryPort,
  unitOfWorkDiToken,
  UnitOfWorkPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

export type CreateReviewerDomainServiceOptions = CreateReviewerAggregateOptions;
export type RemoveReviewerDomainServiceOptions = {
  reviewerId: ReviewerIdValueObject;
};

@Injectable()
export class ReviewerManagementDomainService {
  constructor(
    @Inject(reviewerRepositoryDiToken)
    private readonly reviewerRepository: ReviewerRepositoryPort,
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async isReviewerExistById(id: ReviewerIdValueObject) {
    return Boolean(await this.reviewerRepository.findOneById(id));
  }

  async getReviewerById(id: ReviewerIdValueObject) {
    return this.reviewerRepository.findOneById(id);
  }

  async getReviewerByName(name: ReviewerNameValueObject) {
    return this.reviewerRepository.findOneByName(name);
  }

  async createReviewer(
    options: CreateReviewerDomainServiceOptions,
  ): Promise<ReviewerCreatedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
      const { name } = options;
      const exist = await this.reviewerRepository.findOneByName(name);

      if (exist) {
        throw new ReviewerDomainExceptions.DoesExist();
      }

      const reviewer = new ReviewerAggregate();
      const reviewerCreated = reviewer.createReviewer(options);
      await this.reviewerRepository.save(reviewer);

      return reviewerCreated;
    });
  }

  async removeReviewer(command: RemoveReviewerCommand) {
    return this.unitOfWork.runInTransaction(async () => {
      const { id } = command;
      const exist = await this.reviewerRepository.findOneById(id);

      if (!exist) {
        throw new ReviewerDomainExceptions.DoesNotExist();
      }

      const removed = await this.reviewerRepository.delete(exist);

      return new ReviewerRemovedDomainEvent({ id });
    });
  }
}
