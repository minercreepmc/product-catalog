import { ProductAggregate } from '@aggregates/product';
import { ReviewerAggregate } from '@aggregates/reviewer';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductRepositoryPort,
  ReviewerRepositoryPort,
} from '@domain-interfaces';
import { ProductApprovalDomainService } from '@domain-services';
import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { TextValueObject } from 'common-base-classes';
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';

describe('ProductApprovalDomainService', () => {
  let productApprovalDomainService: ProductApprovalDomainService;
  let productRepository: DeepMockProxy<ProductRepositoryPort>;
  let reviewerRepository: DeepMockProxy<ReviewerRepositoryPort>;
  let existedProduct: MockProxy<ProductAggregate>;
  let existedReviewer: MockProxy<ReviewerAggregate>;

  beforeEach(() => {
    jest.resetAllMocks();
    productRepository = mockDeep<ProductRepositoryPort>(productRepository);
    reviewerRepository = mockDeep<ReviewerRepositoryPort>(reviewerRepository);
    existedProduct = mock<ProductAggregate>();
    existedReviewer = mock<ReviewerAggregate>();
    productApprovalDomainService = new ProductApprovalDomainService(
      productRepository,
      reviewerRepository,
    );
  });

  describe('submitForApproval', () => {
    it('should submit a product for approval', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      productRepository.findOneById.mockResolvedValue(existedProduct);
      reviewerRepository.findOneById.mockResolvedValue(existedReviewer);

      await productApprovalDomainService.submitForApproval({
        productId,
        reviewerId,
      });

      expect(existedProduct.submitForApproval).toHaveBeenCalledWith(reviewerId);
      expect(productRepository.save).toHaveBeenCalledWith(existedProduct);
    });

    it('should throw an error if product is not exist', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      productRepository.findOneById.mockResolvedValueOnce(null);

      await expect(
        productApprovalDomainService.submitForApproval({
          productId,
          reviewerId,
        }),
      ).rejects.toThrowError(new ProductDomainExceptions.DoesNotExist());
    });

    it('should throw an error if reviewer is not exist', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      productRepository.findOneById.mockResolvedValueOnce(existedProduct);
      reviewerRepository.findOneById.mockResolvedValueOnce(null);

      await expect(
        productApprovalDomainService.submitForApproval({
          productId,
          reviewerId,
        }),
      ).rejects.toThrowError(new ReviewerDomainExceptions.DoesNotExist());
    });
  });

  describe('approveProduct', () => {
    it('should approve a product', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const product = {
        approve: jest.fn(),
      };
      const reviewer = {
        role: {
          isAdmin: jest.fn().mockReturnValueOnce(true),
        },
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );
      (reviewerRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        reviewer,
      );

      await productApprovalDomainService.approveProduct({
        productId,
        reviewerId,
      });

      expect(reviewer.role.isAdmin).toHaveBeenCalled();
      expect(product.approve).toHaveBeenCalledWith(reviewerId);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if the reviewer is not an admin', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const product = {};
      const reviewer = {
        role: {
          isAdmin: jest.fn().mockReturnValueOnce(false),
        },
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );
      (reviewerRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        reviewer,
      );

      await expect(
        productApprovalDomainService.approveProduct({ productId, reviewerId }),
      ).rejects.toThrow(ReviewerDomainExceptions.NotAuthorizedToApprove);
    });
  });

  describe('rejectProduct', () => {
    it('should reject a product', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const reason = new RejectionReasonValueObject(
        'Not suitable for our store',
      );
      const product = {
        reject: jest.fn(),
      };
      const reviewer = {
        role: {
          isAdmin: jest.fn().mockReturnValueOnce(true),
        },
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );
      (reviewerRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        reviewer,
      );

      await productApprovalDomainService.rejectProduct({
        productId,
        reviewerId,
        reason,
      });

      expect(reviewer.role.isAdmin).toHaveBeenCalled();
      expect(product.reject).toHaveBeenCalledWith(reviewerId, reason);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if the reviewer is not an admin', async () => {
      const productId = new ProductIdValueObject('1');
      const reviewerId = new ReviewerIdValueObject('1');
      const reason = new RejectionReasonValueObject(
        'Not suitable for our store',
      );
      const product = {};
      const reviewer = {
        role: {
          isAdmin: jest.fn().mockReturnValueOnce(false),
        },
      };
      (productRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        product,
      );
      (reviewerRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        reviewer,
      );

      await expect(
        productApprovalDomainService.rejectProduct({
          productId,
          reviewerId,
          reason,
        }),
      ).rejects.toThrow(ReviewerDomainExceptions.NotAuthorizedToReject);
    });
  });
});
