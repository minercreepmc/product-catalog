import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

export class CreateReviewerCommand {
  readonly name: ReviewerNameValueObject;
  readonly email: ReviewerEmailValueObject;
  readonly role: ReviewerRoleValueObject;
  constructor(dtos: CreateReviewerCommand) {
    this.name = dtos.name;
    this.email = dtos.email;
    this.role = dtos.role;
  }
}
