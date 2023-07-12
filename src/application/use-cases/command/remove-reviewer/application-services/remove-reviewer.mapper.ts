import { CommandMapperBase } from '@base/use-cases';
import { RemoveReviewerCommand } from '@commands';
import { ReviewerRemovedDomainEvent } from '@domain-events/reviewer';
import { Injectable } from '@nestjs/common';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { RemoveReviewerRequestDto, RemoveReviewerResponseDto } from '../dtos';

@Injectable()
export class RemoveReviewerMapper extends CommandMapperBase<RemoveReviewerResponseDto> {
  toCommand(dto: RemoveReviewerRequestDto): RemoveReviewerCommand {
    return new RemoveReviewerCommand({
      id: new ReviewerIdValueObject(dto?.id),
    });
  }
  toResponseDto(event: ReviewerRemovedDomainEvent): RemoveReviewerResponseDto {
    return new RemoveReviewerResponseDto({
      id: event.id.unpack(),
    });
  }
}
