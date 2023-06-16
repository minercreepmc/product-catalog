import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { Injectable } from '@nestjs/common';
import { CreateReviewerCommand } from '@commands';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { CreateReviewerRequestDto, CreateReviewerResponseDto } from '../dtos';
import { UseCaseMapperBase } from '@base/use-cases';

@Injectable()
export class CreateReviewerMapper extends UseCaseMapperBase<CreateReviewerResponseDto> {
  toCommand(dto: CreateReviewerRequestDto): CreateReviewerCommand {
    const { email, name, role } = dto;
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
