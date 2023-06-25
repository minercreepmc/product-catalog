import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ApproveProductRequestValidator } from '@use-cases/approve-product/application-services';
import { ApproveProductRequestDto } from '@use-cases/approve-product/dtos';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

describe('ApproveProductCommandValidator', () => {
  let validator: ApproveProductRequestValidator;

  beforeEach(() => {
    validator = new ApproveProductRequestValidator();
  });

  describe('validate', () => {
    it('should return valid if both productId and reviewerId are valid', () => {
      const command: ApproveProductRequestDto = {
        productId: new ProductIdValueObject().unpack(),
        reviewerId: new ReviewerIdValueObject().unpack(),
      };

      const result = validator.validate(command);

      expect(result.isValid).toBe(true);
    });

    it('should throw a validation exception if productId is not valid', () => {
      const command: ApproveProductRequestDto = {
        productId: '',
        reviewerId: new ReviewerIdValueObject().unpack(),
      };

      const response = validator.validate(command);
      expect(response.isValid).toBe(false);
      expect(response.exceptions).toIncludeAllMembers([
        new ProductDomainExceptions.IdDoesNotValid(),
      ]);
    });

    it('should throw a validation exception if reviewerId is not valid', () => {
      const command: ApproveProductRequestDto = {
        productId: '123',
        reviewerId: '',
      };

      const response = validator.validate(command);
      expect(response.isValid).toBe(false);
      expect(response.exceptions).toIncludeAllMembers([
        new ReviewerDomainExceptions.IdDoesNotValid(),
      ]);
    });
  });
});
