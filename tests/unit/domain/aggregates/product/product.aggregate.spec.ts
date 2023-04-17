import {
  CreateProductAggregateOptions,
  ProductAggregate,
} from '@aggregates/product';
import {
  ProductApprovedDomainEvent,
  ProductCreatedDomainEvent,
  ProductRejectedDomainEvent,
  ProductSubmittedDomainEvent,
  ProductUpdatedDomainEvent,
} from '@domain-events/product';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import {
  ProductDescriptionValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatusEnum,
  ProductStatusValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { InvalidOperationException } from 'common-base-classes';

describe('ProductAggregate', () => {
  let productAggregate: ProductAggregate;

  beforeEach(() => {
    productAggregate = new ProductAggregate();
  });

  describe('createProduct', () => {
    it('should create a product with the provided options and return a ProductCreatedDomainEvent', () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
        }),
        description: new ProductDescriptionValueObject('Test Description'),
        image: new ProductImageValueObject('https://example.com/image.png'),
      };
      const event = productAggregate.createProduct(options);

      expect(event).toBeInstanceOf(ProductCreatedDomainEvent);
      expect(productAggregate.getStatus()).toBe(ProductStatusEnum.DRAFT);
      expect(productAggregate.details.name).toBe(options.name);
      expect(productAggregate.details.price).toBe(options.price);
      expect(productAggregate.details.description).toBe(options.description);
      expect(productAggregate.details.image).toBe(options.image);
    });

    it('should create a product with required properties and ignore the optional properties', () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
        }),
      };
      const event = productAggregate.createProduct(options);

      expect(event).toBeInstanceOf(ProductCreatedDomainEvent);
      expect(productAggregate.getStatus()).toBe(ProductStatusEnum.DRAFT);
      expect(productAggregate.details.name).toBe(options.name);
      expect(productAggregate.details.price).toBe(options.price);
    });

    it('should throw an InvalidOperationException if the product is already in DRAFT status', () => {
      productAggregate.setStatus(ProductStatusEnum.DRAFT);

      const options = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
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
          currency: MoneyCurrencyEnum.USD,
        }),
      };

      productAggregate.createProduct(createOptions);

      const updateOptions = {
        name: new ProductNameValueObject('New Test Product'),
        price: ProductPriceValueObject.create({
          amount: 110,
          currency: MoneyCurrencyEnum.USD,
        }),
      };

      const event = productAggregate.updateProduct(updateOptions);

      expect(event).toBeInstanceOf(ProductUpdatedDomainEvent);
      expect(productAggregate.details.name).toBe(updateOptions.name);
      expect(productAggregate.details.price).toBe(updateOptions.price);
    });
  });

  describe('Business method', () => {
    it('should submit a product for approval and return a domain event', () => {
      // Arrange
      const reviewerId = new ReviewerIdValueObject();
      const createProductOptions: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
        }),
      };
      const productAggregate = new ProductAggregate();
      productAggregate.createProduct(createProductOptions);

      // Act
      const actualEvent = productAggregate.submitForApproval(reviewerId);

      const expectedEvent = new ProductSubmittedDomainEvent({
        productId: productAggregate.id,
        details: {
          reviewerId: reviewerId,
          productStatus: new ProductStatusValueObject(
            ProductStatusEnum.PENDING_APPROVAL,
          ),
        },
      });

      // Assert
      expect(actualEvent.details).toEqual(expectedEvent.details);
      expect(actualEvent.productId).toEqual(expectedEvent.productId);
      expect(productAggregate.getStatus()).toEqual(
        ProductStatusEnum.PENDING_APPROVAL,
      );
    });

    it('should throw an error when trying to submit a non-draft product for approval', () => {
      const reviewerId = new ReviewerIdValueObject();
      productAggregate.createProduct({
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
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
          currency: MoneyCurrencyEnum.USD,
        }),
      });
      productAggregate.submitForApproval(reviewerId);
      const productApproved = productAggregate.approve(reviewerId);
      expect(productApproved).toBeInstanceOf(ProductApprovedDomainEvent);

      expect(productAggregate.details.status.unpack()).toBe(
        ProductStatusEnum.APPROVED,
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
      const reason = new RejectionReasonValueObject(
        'Not suitable for our store',
      );
      productAggregate.createProduct({
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
        }),
      });
      productAggregate.submitForApproval(reviewerId);
      const rejectEvent = productAggregate.reject(reviewerId, reason);

      expect(productAggregate.details.status.unpack()).toBe(
        ProductStatusEnum.REJECTED,
      );
      expect(productAggregate.details.rejectedBy).toBe(reviewerId);
      expect(productAggregate.details.rejectionReason).toBe(reason);

      // Test if the reject method returns the correct domain event
      expect(rejectEvent).toBeInstanceOf(ProductRejectedDomainEvent);
      expect(rejectEvent.entityId).toEqual(productAggregate.id);
      expect(rejectEvent.details.rejectedBy).toEqual(reviewerId);
      expect(rejectEvent.details.productStatus).toEqual(
        productAggregate.status,
      );
      expect(rejectEvent.details.reason).toEqual(reason);
    });

    it('should throw an error when trying to reject a non-pending product', () => {
      const reviewerId = new ReviewerIdValueObject();
      const reason = new RejectionReasonValueObject(
        'Not suitable for our store',
      );
      expect(() => productAggregate.reject(reviewerId, reason)).toThrowError(
        InvalidOperationException,
      );
    });
  });
});
