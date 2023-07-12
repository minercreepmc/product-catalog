import { CommandMapperBase } from '@base/use-cases';
import { RejectProductCommand } from '@commands';
import { ProductRejectedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { RejectProductRequestDto, RejectProductResponseDto } from '../dtos';

@Injectable()
export class RejectProductMapper extends CommandMapperBase<RejectProductResponseDto> {
  toCommand(dto: RejectProductRequestDto): RejectProductCommand {
    const { reason, productId, reviewerId } = dto;

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
