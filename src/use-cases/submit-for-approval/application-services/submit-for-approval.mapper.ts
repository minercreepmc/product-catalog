import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  SubmitForApprovalCommand,
  SubmitForApprovalDomainOptions,
  SubmitForApprovalResponseDto,
} from '../dtos';

@Injectable()
export class SubmitForApprovalMapper {
  toDomain(command: SubmitForApprovalCommand): SubmitForApprovalDomainOptions {
    const { reviewerId, productId } = command;
    return {
      productId: new ProductIdValueObject(productId),
      reviewerId: new ReviewerIdValueObject(reviewerId),
    };
  }

  toResponseDto(
    event: ProductSubmittedDomainEvent,
  ): SubmitForApprovalResponseDto {
    return new SubmitForApprovalResponseDto({
      reviewerId: event.details.reviewerId.unpack(),
      productId: event.productId.unpack(),
      productStatus: event.details.productStatus.unpack(),
    });
  }
}
