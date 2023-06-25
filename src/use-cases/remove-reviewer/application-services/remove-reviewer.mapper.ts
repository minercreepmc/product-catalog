import { UseCaseMapperBase } from '@base/use-cases';
import { RemoveReviewerCommand } from '@commands';
import { ReviewerRemovedDomainEvent } from '@domain-events/reviewer';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { RemoveReviewerRequestDto, RemoveReviewerResponseDto } from '../dtos';

export class RemoveReviewerMapper extends UseCaseMapperBase<RemoveReviewerResponseDto> {
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
