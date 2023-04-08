import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

export interface ReviewerAggregateDetails {
  name: ReviewerNameValueObject;
  email: ReviewerEmailValueObject;
  role: ReviewerRoleValueObject;
}

export interface CreateReviewerAggregateOptions {
  name: ReviewerNameValueObject;
  email: ReviewerEmailValueObject;
  role: ReviewerRoleValueObject;
}

export interface UpdateReviewerAggregateOptions {
  name: ReviewerNameValueObject;
}
