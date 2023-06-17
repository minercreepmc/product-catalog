import {
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

export interface ReviewerAggregateDetails {
  name: ReviewerNameValueObject;
  role: ReviewerRoleValueObject;
}

export interface CreateReviewerAggregateOptions {
  name: ReviewerNameValueObject;
  role: ReviewerRoleValueObject;
}

export interface UpdateReviewerAggregateOptions {
  name: ReviewerNameValueObject;
}
