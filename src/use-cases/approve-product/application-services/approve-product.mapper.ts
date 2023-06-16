import { UseCaseMapperBase } from '@base/use-cases';
import { ApproveProductCommand } from '@commands';
import { ProductApprovedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { ApproveProductRequestDto, ApproveProductResponseDto } from '../dtos';

@Injectable()
export class ApproveProductMapper extends UseCaseMapperBase<ApproveProductResponseDto> {
  toCommand(dto: ApproveProductRequestDto): ApproveProductCommand {
    const { productId, reviewerId } = dto;
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
