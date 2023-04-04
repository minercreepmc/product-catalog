import { Inject, Injectable } from '@nestjs/common';
import {
  CreateReviewerAggregateOptions,
  ReviewerAggregate,
} from '@reviewer-domain/aggregate';
import { ReviewerCreatedDomainEvent } from '@reviewer-domain/domain-events';
import { ReviewerDomainExceptions } from '@reviewer-domain/domain-exceptions';
import {
  reviewerRepositoryDiToken,
  ReviewerRepositoryPort,
} from '@reviewer-domain/interfaces';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
} from '@reviewer-domain/value-objects';

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

  async getReviewerById(id: ReviewerIdValueObject) {
    return this.reviewerRepository.findOneById(id);
  }

  async createReviewer(
    options: CreateReviewerDomainServiceOptions,
  ): Promise<ReviewerCreatedDomainEvent> {
    const { email } = options;
    const exist = await this.reviewerRepository.findOneByEmail(email);

    if (exist) {
      throw new ReviewerDomainExceptions.IsExist();
    }

    const reviewer = new ReviewerAggregate();
    const reviewerCreated = reviewer.createReviewer(options);
    await this.reviewerRepository.save(reviewer);
    return reviewerCreated;
  }
}
