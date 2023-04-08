import {
  CreateReviewerAggregateOptions,
  ReviewerAggregate,
} from '@aggregates/reviewer';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  reviewerRepositoryDiToken,
  ReviewerRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
} from '@value-objects/reviewer';

export type CreateReviewerDomainServiceOptions = CreateReviewerAggregateOptions;

@Injectable()
export class ReviewerManagementDomainService {
  constructor(
    @Inject(reviewerRepositoryDiToken)
    private readonly reviewerRepository: ReviewerRepositoryPort,
  ) {}

  async getReviewerByEmail(
    email: ReviewerEmailValueObject,
  ): Promise<ReviewerAggregate> {
    return this.reviewerRepository.findOneByEmail(email);
  }

  async isReviewerExistById(id: ReviewerIdValueObject) {
    return Boolean(await this.reviewerRepository.findOneById(id));
  }

  async getReviewerById(id: ReviewerIdValueObject) {
    return this.reviewerRepository.findOneById(id);
  }

  async createReviewer(
    options: CreateReviewerDomainServiceOptions,
  ): Promise<ReviewerCreatedDomainEvent> {
    const { email } = options;
    const exist = await this.reviewerRepository.findOneByEmail(email);

    if (exist) {
      throw new ReviewerDomainExceptions.DoesExist();
    }

    const reviewer = new ReviewerAggregate();
    const reviewerCreated = reviewer.createReviewer(options);
    await this.reviewerRepository.save(reviewer);
    return reviewerCreated;
  }
}
