import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { Injectable } from '@nestjs/common';
import { CreateReviewerCommand } from '@commands';
import {
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { CreateReviewerRequestDto, CreateReviewerResponseDto } from '../dtos';
import { UseCaseMapperBase } from '@base/use-cases';

@Injectable()
export class CreateReviewerMapper extends UseCaseMapperBase<CreateReviewerResponseDto> {
  toCommand(dto: CreateReviewerRequestDto): CreateReviewerCommand {
    const { name, role } = dto;
    return {
      name: new ReviewerNameValueObject(name),
      role: new ReviewerRoleValueObject(role),
    };
  }

  toResponseDto(event: ReviewerCreatedDomainEvent): CreateReviewerResponseDto {
    const { name, role } = event.details;
    return new CreateReviewerResponseDto({
      role: role.unpack(),
      name: name.unpack(),
      reviewerId: event.reviewerId.unpack(),
    });
  }
  //
  // toSagaStates(dto: CreateReviewerRequestDto): CreateReviewerSagaStates {
  //   return new CreateReviewerSagaStates(dto);
  // }
}
