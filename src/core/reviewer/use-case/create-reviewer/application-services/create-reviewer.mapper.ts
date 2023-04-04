import { Injectable } from '@nestjs/common';
import { ReviewerCreatedDomainEvent } from '@reviewer-domain/domain-events';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
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
