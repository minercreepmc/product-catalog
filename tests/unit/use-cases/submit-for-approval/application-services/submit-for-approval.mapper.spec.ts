import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { SubmitForApprovalMapper } from '@use-cases/submit-for-approval/application-services';
import {
  SubmitForApprovalCommand,
  SubmitForApprovalResponseDto,
} from '@use-cases/submit-for-approval/dtos';
import {
  ProductIdValueObject,
  ProductStatus,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('SubmitForApprovalMapper', () => {
  let mapper: SubmitForApprovalMapper;

  beforeEach(() => {
    mapper = new SubmitForApprovalMapper();
  });

  describe('toDomain', () => {
    it('should map the command to domain options', () => {
      const command = new SubmitForApprovalCommand({
        reviewerId: 'abc123',
        productId: '123',
      });

      const expectedDomainOptions = {
        productId: new ProductIdValueObject('123'),
        reviewerId: new ReviewerIdValueObject('abc123'),
      };

      const domainOptions = mapper.toDomain(command);

      expect(domainOptions).toEqual(expectedDomainOptions);
    });
  });

  describe('toResponseDto', () => {
    it('should map the event to a response DTO', () => {
      const event = new ProductSubmittedDomainEvent({
        productId: new ProductIdValueObject('123'),
        details: {
          reviewerId: new ReviewerIdValueObject('abc123'),
          productStatus: new ProductStatusValueObject(
            ProductStatus.PENDING_APPROVAL,
          ),
        },
      });

      const expectedResponseDto = new SubmitForApprovalResponseDto({
        reviewerId: 'abc123',
        productId: '123',
        productStatus: ProductStatus.PENDING_APPROVAL,
      });

      const responseDto = mapper.toResponseDto(event);

      expect(responseDto).toEqual(expectedResponseDto);
    });
  });
});
