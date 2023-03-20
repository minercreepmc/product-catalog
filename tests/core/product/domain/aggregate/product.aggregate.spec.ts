import {
  CreateProductAggregateOptions,
  ProductAggregate,
  UpdateProductAggregateOptions,
} from '@product-domain/aggregate';
import {
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductImageValueObject,
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
    productAggregate.createProduct({
      name: new ProductNameValueObject('Product 1'),
      price: new ProductPriceValueObject(199),
    });
  });

  describe('Creation', () => {
    test('createProduct should initialize a product with the given options', () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: new ProductPriceValueObject(10),
      };
      const product = new ProductAggregate();
      product.createProduct(options);

      expect(product.details.name).toEqual(options.name);
      expect(product.details.price).toEqual(options.price);
      expect(product.details.description).toBeUndefined();
      expect(product.details.image).toBeUndefined();
      expect(product.details.attributes).toBeUndefined();
    });

    test('createProduct should initialize a product with optional fields', () => {
      const attributes = ProductAttributesValueObject.createMultiple([
        {
          size: 'large',
          weight: {
            amount: 10,
            unit: 'kg',
          },
          color: 'white',
        },
      ]);
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        description: new ProductDescriptionValueObject('Test description'),
        price: new ProductPriceValueObject(10),
        image: new ProductImageValueObject('https://example.com/image.jpg'),
        attributes,
      };
      const product = new ProductAggregate();
      product.createProduct(options);

      expect(product.details.name).toEqual(options.name);
      expect(product.details.description).toEqual(options.description);
      expect(product.details.price).toEqual(options.price);
      expect(product.details.image).toEqual(options.image);
      expect(product.details.attributes).toEqual(options.attributes);
    });

    test('updateProduct should update product fields', () => {
      const product = new ProductAggregate();
      const createOptions: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: new ProductPriceValueObject(10),
      };
      product.createProduct(createOptions);

      const updateOptions: UpdateProductAggregateOptions = {
        name: new ProductNameValueObject('Updated Product'),
        price: new ProductPriceValueObject(20),
      };
      product.updateProduct(updateOptions);

      expect(product.details.name).toEqual(updateOptions.name);
      expect(product.details.price).toEqual(updateOptions.price);
    });

    test('updateProduct should update optional fields', () => {
      const attributes = ProductAttributesValueObject.createMultiple([
        {
          size: 'large',
          weight: {
            amount: 10,
            unit: 'kg',
          },
          color: 'white',
        },
      ]);
      const product = new ProductAggregate();
      const createOptions: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: new ProductPriceValueObject(10),
      };
      product.createProduct(createOptions);

      const updateOptions: UpdateProductAggregateOptions = {
        description: new ProductDescriptionValueObject('Updated description'),
        image: new ProductImageValueObject(
          'https://example.com/updated-image.jpg',
        ),
        attributes,
      };
      product.updateProduct(updateOptions);

      expect(product.details.description).toEqual(updateOptions.description);
      expect(product.details.image).toEqual(updateOptions.image);
      expect(product.details.attributes).toEqual(updateOptions.attributes);
    });
  });

  describe('Business method', () => {
    it('should submit a product for approval', () => {
      const reviewerId = new ReviewerIdValueObject();
      productAggregate.submitForApproval(reviewerId);
      expect(productAggregate.details.status.unpack()).toBe(
        ProductStatus.PENDING_APPROVAL,
      );
    });

    it('should throw an error when trying to submit a non-draft product for approval', () => {
      const reviewerId = new ReviewerIdValueObject();
      productAggregate.submitForApproval(reviewerId);
      expect(() => productAggregate.submitForApproval(reviewerId)).toThrowError(
        InvalidOperationException,
      );
    });

    it('should approve a product', () => {
      const reviewerId = new ReviewerIdValueObject();
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
