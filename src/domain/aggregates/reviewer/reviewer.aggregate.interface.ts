import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

export interface ReviewerAggregateDetails {
  name: ReviewerNameValueObject;
  email: ReviewerEmailValueObject;
}

export interface CreateReviewerAggregateOptions {
  name: ReviewerNameValueObject;
  email: ReviewerEmailValueObject;
}

export interface UpdateReviewerAggregateOptions {
  name: ReviewerNameValueObject;
}
