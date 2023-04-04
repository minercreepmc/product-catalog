import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@reviewer-domain/aggregate';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
import { RepositoryPort } from 'common-base-classes';

export interface ReviewerRepositoryPort
  extends RepositoryPort<ReviewerAggregate, ReviewerAggregateDetails> {
  findOneByName(name: ReviewerNameValueObject): Promise<ReviewerAggregate>;
  findOneByEmail(email: ReviewerEmailValueObject): Promise<ReviewerAggregate>;
}

export const reviewerRepositoryDiToken = Symbol('REVIEWER_REPOSITORY');
