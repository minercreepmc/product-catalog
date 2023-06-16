import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@aggregates/reviewer';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';
import { RepositoryPort } from '@domain-interfaces';

export interface ReviewerRepositoryPort
  extends RepositoryPort<ReviewerAggregate, ReviewerAggregateDetails> {
  findOneByName(name: ReviewerNameValueObject): Promise<ReviewerAggregate>;
  findOneByEmail(email: ReviewerEmailValueObject): Promise<ReviewerAggregate>;
}

export const reviewerRepositoryDiToken = Symbol('REVIEWER_REPOSITORY');
