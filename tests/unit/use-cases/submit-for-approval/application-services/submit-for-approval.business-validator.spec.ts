import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { SubmitForApprovalBusinessValidator } from '@use-cases/submit-for-approval/application-services';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SubmitForApprovalBusinessValidator', () => {
  let businessValidator: SubmitForApprovalBusinessValidator;
  let productManagementService: MockProxy<ProductManagementDomainService>;
  let reviewerManagementService: MockProxy<ReviewerManagementDomainService>;

  beforeEach(() => {
    productManagementService = mock<ProductManagementDomainService>();
    reviewerManagementService = mock<ReviewerManagementDomainService>();
    businessValidator = new SubmitForApprovalBusinessValidator(
      productManagementService,
      reviewerManagementService,
    );
  });

  describe('validate', () => {
    it('should pass validation if product and reviewer exist', async () => {
      const productId = new ProductIdValueObject();
      const reviewerId = new ReviewerIdValueObject();
      productManagementService.isProductExistById.mockResolvedValue(true);
      reviewerManagementService.isReviewerExistById.mockResolvedValue(true);

      const result = await businessValidator.execute({
        productId,
        reviewerId,
      });

      expect(productManagementService.isProductExistById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        reviewerManagementService.isReviewerExistById,
      ).toHaveBeenCalledWith(reviewerId);
      expect(result.isValid).toBeTruthy();
      expect(result.exceptions).toHaveLength(0);
    });

    it('should fail validation if product does not exist', async () => {
      const productId = new ProductIdValueObject();
      const reviewerId = new ReviewerIdValueObject();
      productManagementService.isProductExistById.mockResolvedValue(false);
      reviewerManagementService.isReviewerExistById.mockResolvedValue(true);

      const result = await businessValidator.execute({
        productId,
        reviewerId,
      });

      expect(productManagementService.isProductExistById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        reviewerManagementService.isReviewerExistById,
      ).toHaveBeenCalledWith(reviewerId);
      expect(result.isValid).toBeFalsy();
      expect(result.exceptions).toHaveLength(1);
      expect(result.exceptions).toIncludeAllMembers([
        new ProductDomainExceptions.DoesNotExist(),
      ]);
    });

    it('should fail validation if reviewer does not exist', async () => {
      const productId = new ProductIdValueObject();
      const reviewerId = new ReviewerIdValueObject();
      productManagementService.isProductExistById.mockResolvedValue(true);
      reviewerManagementService.isReviewerExistById.mockResolvedValue(false);

      const result = await businessValidator.execute({
        productId,
        reviewerId,
      });

      expect(productManagementService.isProductExistById).toHaveBeenCalledWith(
        productId,
      );
      expect(
        reviewerManagementService.isReviewerExistById,
      ).toHaveBeenCalledWith(reviewerId);
      expect(result.isValid).toBeFalsy();
      expect(result.exceptions).toHaveLength(1);
      expect(result.exceptions).toIncludeAllMembers([
        new ReviewerDomainExceptions.DoesNotExist(),
      ]);
    });
  });
});
