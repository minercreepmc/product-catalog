import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';

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
