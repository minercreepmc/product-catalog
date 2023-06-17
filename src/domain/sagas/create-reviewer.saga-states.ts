import { ReviewerAggregateDetails } from '@aggregates/reviewer';
import { CreateReviewerDomainServiceOptions } from '@domain-services';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export class CreateUserRequestDto {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  constructor(options: CreateUserRequestDto) {
    this.username = options.username;
    this.email = options.email;
    this.password = options.password;
  }
}

export class CreateReviewerSagaStates {
  readonly username: string;
  readonly email: string;
  readonly password: string;

  constructor(
    reviewerId: ReviewerIdValueObject,
    details: ReviewerAggregateDetails,
  ) {
    this.username = details.username.unpack();
    this.email = details.email.unpack();
    this.password = details.password.unpack();
  }

  makeCreateUserRequestDto(): CreateUserRequestDto {
    return new CreateUserRequestDto({
      username: this.username,
      email: this.email,
      password: this.password,
    });
  }
}
