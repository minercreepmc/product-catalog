import { ProductRepositoryPort } from '@product-domain/interfaces';
import { ProductApprovalDomainService } from '@product-domain/services';
import { ProductIdValueObject } from '@product-domain/value-objects';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import { TextValueObject } from 'common-base-classes';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ProductApprovalDomainService', () => {
  let productApprovalDomainService: ProductApprovalDomainService;
  let productRepository: DeepMockProxy<ProductRepositoryPort>;

  beforeEach(() => {
    productRepository = mockDeep<ProductRepositoryPort>(productRepository);
    productApprovalDomainService = new ProductApprovalDomainService(
      productRepository,
    );
  });

  describe('submitForApproval', () => {
    it('should submit a product for approval', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const product = {
        submitForApproval: jest.fn(),
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );

      await productApprovalDomainService.submitForApproval(
        productId,
        reviewerId,
      );

      expect(product.submitForApproval).toHaveBeenCalledWith(reviewerId);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('approveProduct', () => {
    it('should approve a product', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const product = {
        isPendingApprovalBy: jest.fn().mockReturnValueOnce(true),
        approve: jest.fn(),
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );

      await productApprovalDomainService.approveProduct(productId, reviewerId);

      expect(product.isPendingApprovalBy).toHaveBeenCalledWith(reviewerId);
      expect(product.approve).toHaveBeenCalledWith(reviewerId);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if the product is not pending approval by the reviewer', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const product = {
        isPendingApprovalBy: jest.fn().mockReturnValueOnce(false),
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );

      await expect(
        productApprovalDomainService.approveProduct(productId, reviewerId),
      ).rejects.toThrow(
        'This product is not pending approval by this reviewer',
      );
    });
  });

  describe('rejectProduct', () => {
    it('should reject a product', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const reason = new TextValueObject('reason');
      const product = {
        isPendingApprovalBy: jest.fn().mockReturnValueOnce(true),
        reject: jest.fn(),
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );

      await productApprovalDomainService.rejectProduct(
        productId,
        reviewerId,
        reason,
      );

      expect(product.isPendingApprovalBy).toHaveBeenCalledWith(reviewerId);
      expect(product.reject).toHaveBeenCalledWith(reviewerId, reason);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if the product is not pending approval by the reviewer', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const reason = new TextValueObject('reason');
      const product = {
        isPendingApprovalBy: jest.fn().mockReturnValueOnce(false),
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );

      await expect(
        productApprovalDomainService.rejectProduct(
          productId,
          reviewerId,
          reason,
        ),
      ).rejects.toThrow(
        'This product is not pending approval by this reviewer',
      );
    });
  });
});
