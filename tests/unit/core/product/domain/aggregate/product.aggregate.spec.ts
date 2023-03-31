import { AllowableCurrencyEnum } from '@common-domain/value-objects/money';
import { ProductAggregate } from '@product-domain/aggregate';
import {
  ProductCreatedDomainEvent,
  ProductUpdatedDomainEvent,
} from '@product-domain/domain-events';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatus,
} from '@product-domain/value-objects';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import {
  InvalidOperationException,
  TextValueObject,
} from 'common-base-classes';

describe('ProductAggregate', () => {
  let productAggregate: ProductAggregate;

  beforeEach(() => {
    productAggregate = new ProductAggregate();
  });

  describe('createProduct', () => {
    it('should create a product with the provided options and return a ProductCreatedDomainEvent', () => {
      const options = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      const event = productAggregate.createProduct(options);

      expect(event).toBeInstanceOf(ProductCreatedDomainEvent);
      expect(productAggregate.getStatus()).toBe(ProductStatus.DRAFT);
      expect(productAggregate.details.name).toBe(options.name);
      expect(productAggregate.details.price).toBe(options.price);
    });

    it('should throw an InvalidOperationException if the product is already in DRAFT status', () => {
      productAggregate.setStatus(ProductStatus.DRAFT);

      const options = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      expect(() => productAggregate.createProduct(options)).toThrowError(
        InvalidOperationException,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update the product with the provided options and return a ProductUpdatedDomainEvent', () => {
      const createOptions = {
        name: new ProductNameValueObject('Old Test Product'),
        price: ProductPriceValueObject.create({
          amount: 90,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      productAggregate.createProduct(createOptions);

      const updateOptions = {
        name: new ProductNameValueObject('New Test Product'),
        price: ProductPriceValueObject.create({
          amount: 110,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      const event = productAggregate.updateProduct(updateOptions);

      expect(event).toBeInstanceOf(ProductUpdatedDomainEvent);
      expect(productAggregate.details.name).toBe(updateOptions.name);
      expect(productAggregate.details.price).toBe(updateOptions.price);
    });
  });

  describe('Business method', () => {
    it('should submit a product for approval', () => {
      const reviewerId = new ReviewerIdValueObject();
      productAggregate.createProduct({
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      });
      productAggregate.submitForApproval(reviewerId);
      expect(productAggregate.details.status.unpack()).toBe(
        ProductStatus.PENDING_APPROVAL,
      );
    });

    it('should throw an error when trying to submit a non-draft product for approval', () => {
      const reviewerId = new ReviewerIdValueObject();
      productAggregate.createProduct({
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      });
      productAggregate.submitForApproval(reviewerId);
      expect(() => productAggregate.submitForApproval(reviewerId)).toThrowError(
        InvalidOperationException,
      );
    });

    it('should approve a product', () => {
      const reviewerId = new ReviewerIdValueObject();
      productAggregate.createProduct({
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      });
      productAggregate.submitForApproval(reviewerId);
      productAggregate.approve(reviewerId);

      expect(productAggregate.details.status.unpack()).toBe(
        ProductStatus.APPROVED,
      );
      expect(productAggregate.details.approvedBy).toBe(reviewerId);
    });

    it('should throw an error when trying to approve a non-pending product', () => {
      const reviewerId = new ReviewerIdValueObject();
      expect(() => productAggregate.approve(reviewerId)).toThrowError(
        InvalidOperationException,
      );
    });

    it('should reject a product', () => {
      const reviewerId = new ReviewerIdValueObject();
      const reason = new TextValueObject('Not suitable for our store');
      productAggregate.createProduct({
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      });
      productAggregate.submitForApproval(reviewerId);
      productAggregate.reject(reviewerId, reason);

      expect(productAggregate.details.status.unpack()).toBe(
        ProductStatus.REJECTED,
      );
      expect(productAggregate.details.rejectedBy).toBe(reviewerId);
      expect(productAggregate.details.rejectionReason).toBe(reason);
    });

    it('should throw an error when trying to reject a non-pending product', () => {
      const reviewerId = new ReviewerIdValueObject();
      const reason = new TextValueObject('Not suitable for our store');
      expect(() => productAggregate.reject(reviewerId, reason)).toThrowError(
        InvalidOperationException,
      );
    });
  });
});
