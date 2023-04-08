import { ProductApprovedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  ApproveProductCommand,
  ApproveProductDomainOptions,
  ApproveProductResponseDto,
} from '../dtos';

@Injectable()
export class ApproveProductMapper {
  toDomain(command: ApproveProductCommand): ApproveProductDomainOptions {
    const { productId, reviewerId } = command;
    return {
      productId: new ProductIdValueObject(productId),
      reviewerId: new ReviewerIdValueObject(reviewerId),
    };
  }

  toResponseDto(event: ProductApprovedDomainEvent): ApproveProductResponseDto {
    return new ApproveProductResponseDto({
      productStatus: event.status.unpack(),
      productId: event.productId.unpack(),
      reviewerId: event.reviewerId.unpack(),
    });
  }
}
