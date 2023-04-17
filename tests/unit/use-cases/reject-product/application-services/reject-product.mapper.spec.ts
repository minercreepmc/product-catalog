import { ProductRejectedDomainEvent } from '@domain-events/product';
import { RejectProductMapper } from '@use-cases/reject-product/application-services';
import {
  RejectProductCommand,
  RejectProductResponseDto,
} from '@use-cases/reject-product/dtos';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('RejectProductMapper', () => {
  let mapper: RejectProductMapper;

  beforeEach(() => {
    mapper = new RejectProductMapper();
  });

  describe('toDomain', () => {
    it('should map a RejectProductCommand to RejectProductDomainOptions', () => {
      const command = new RejectProductCommand({
        reviewerId: 'reviewer-1',
        productId: 'product-1',
        reason: 'Product does not meet quality standards',
      });

      const domainOptions = mapper.toDomain(command);

      expect(domainOptions).toEqual({
        reviewerId: new ReviewerIdValueObject('reviewer-1'),
        productId: new ProductIdValueObject('product-1'),
        reason: new RejectionReasonValueObject(
          'Product does not meet quality standards',
        ),
      });
    });
  });

  describe('toResponseDto', () => {
    it('should map a ProductRejectedDomainEvent to a RejectProductResponseDto', () => {
      const event = new ProductRejectedDomainEvent({
        productId: new ProductIdValueObject('product-1'),
        details: {
          productStatus: ProductStatusValueObject.createRejected(),
          rejectedBy: new ReviewerIdValueObject('reviewer-1'),
          reason: new RejectionReasonValueObject(
            'Product does not meet quality standards',
          ),
        },
      });

      const responseDto = mapper.toResponseDto(event);

      expect(responseDto).toBeInstanceOf(RejectProductResponseDto);
      expect(responseDto.rejectedBy).toEqual('reviewer-1');
      expect(responseDto.productId).toEqual('product-1');
      expect(responseDto.reason).toEqual(
        'Product does not meet quality standards',
      );
    });
  });
});
