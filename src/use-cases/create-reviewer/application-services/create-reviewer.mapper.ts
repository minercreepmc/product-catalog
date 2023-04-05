import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { Injectable } from '@nestjs/common';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';
import {
  CreateReviewerCommand,
  CreateReviewerDomainOptions,
  CreateReviewerResponseDto,
} from '../dtos';

@Injectable()
export class CreateReviewerMapper {
  toDomain(command: CreateReviewerCommand): CreateReviewerDomainOptions {
    const { email, name } = command;
    return {
      email: new ReviewerEmailValueObject(email),
      name: new ReviewerNameValueObject(name),
    };
  }

  toResponseDto(event: ReviewerCreatedDomainEvent): CreateReviewerResponseDto {
    const { name, email } = event.details;
    return {
      reviewerId: event.reviewerId.unpack(),
      name: name.unpack(),
      email: email.unpack(),
    };
  }
}
