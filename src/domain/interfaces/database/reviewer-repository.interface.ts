import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@aggregates/reviewer';
import { ReviewerNameValueObject } from '@value-objects/reviewer';
import { RepositoryPort } from '@domain-interfaces';

export interface ReviewerRepositoryPort
  extends RepositoryPort<ReviewerAggregate, ReviewerAggregateDetails> {
  findOneByName(name: ReviewerNameValueObject): Promise<ReviewerAggregate>;
}

export const reviewerRepositoryDiToken = Symbol('REVIEWER_REPOSITORY');
