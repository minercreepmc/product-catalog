import { ProductApprovedDomainEvent } from '@domain-events/product';
import { ApproveProductMapper } from '@use-cases/approve-product/application-services';
import {
  ApproveProductCommand,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
import {
  ProductIdValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('ApproveProductMapper', () => {
  let mapper: ApproveProductMapper;

  beforeEach(() => {
    mapper = new ApproveProductMapper();
  });

  describe('toDomain', () => {
    it('should return an ApproveProductDomainOptions object with the correct properties', () => {
      const command: ApproveProductCommand = {
        productId: '1',
        reviewerId: '2',
      };

      const result = mapper.toDomain(command);

      expect(result).toEqual({
        productId: new ProductIdValueObject('1'),
        reviewerId: new ReviewerIdValueObject('2'),
      });
    });
  });

  describe('toResponseDto', () => {
    it('should return an ApproveProductResponseDto object with the correct properties', () => {
      const event: ProductApprovedDomainEvent = new ProductApprovedDomainEvent({
        productId: new ProductIdValueObject('1'),
        details: {
          reviewerId: new ReviewerIdValueObject('2'),
          status: new ProductStatusValueObject('approved'),
        },
      });

      const result = mapper.toResponseDto(event);

      expect(result).toEqual(
        new ApproveProductResponseDto({
          reviewerId: '2',
          productId: '1',
          productStatus: 'approved',
        }),
      );
    });
  });
});
