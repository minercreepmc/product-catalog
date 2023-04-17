import { ProductRejectedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  RejectProductCommand,
  RejectProductDomainOptions,
  RejectProductResponseDto,
} from '../dtos';

@Injectable()
export class RejectProductMapper {
  toDomain(command: RejectProductCommand): RejectProductDomainOptions {
    const { reason, productId, reviewerId } = command;

    return {
      reviewerId: new ReviewerIdValueObject(reviewerId),
      productId: new ProductIdValueObject(productId),
      reason: new RejectionReasonValueObject(reason),
    };
  }

  toResponseDto(event: ProductRejectedDomainEvent): RejectProductResponseDto {
    return new RejectProductResponseDto({
      rejectedBy: event.rejectedBy.unpack(),
      productId: event.productId.unpack(),
      reason: event.reason.unpack(),
    });
  }
}
