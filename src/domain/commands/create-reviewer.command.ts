import {
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

export class CreateReviewerCommand {
  readonly name: ReviewerNameValueObject;
  readonly role: ReviewerRoleValueObject;
  constructor(dtos: CreateReviewerCommand) {
    this.name = dtos.name;
    this.role = dtos.role;
  }
}
