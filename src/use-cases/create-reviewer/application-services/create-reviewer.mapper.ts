import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { Injectable } from '@nestjs/common';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import {
  CreateReviewerCommand,
  CreateReviewerDomainOptions,
  CreateReviewerResponseDto,
} from '../dtos';

@Injectable()
export class CreateReviewerMapper {
  toDomain(command: CreateReviewerCommand): CreateReviewerDomainOptions {
    const { email, name, role } = command;
    return {
      email: new ReviewerEmailValueObject(email),
      name: new ReviewerNameValueObject(name),
      role: new ReviewerRoleValueObject(role),
    };
  }

  toResponseDto(event: ReviewerCreatedDomainEvent): CreateReviewerResponseDto {
    const { name, email, role } = event.details;
    return new CreateReviewerResponseDto({
      role: role.unpack(),
      name: name.unpack(),
      email: email.unpack(),
      reviewerId: event.reviewerId.unpack(),
    });
  }
}
