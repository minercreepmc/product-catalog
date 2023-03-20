import {
  ProductStatus,
  ProductStatusArray,
  ProductStatusValueObject,
} from '@product-domain/value-objects';
import { ArgumentDoestNotIncludeInAllowedValues } from 'common-base-classes';

describe('ProductStatusValueObject', () => {
  it('should create a valid ProductStatusValueObject', () => {
    const productStatus = new ProductStatusValueObject(ProductStatus.APPROVED);
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatus.APPROVED);
  });

  it('should throw an error for an invalid ProductStatusValueObject', () => {
    expect(
      () => new ProductStatusValueObject('invalid' as unknown as ProductStatus),
    ).toThrowError();
  });

  it('should validate a valid ProductStatusValueObject', () => {
    const validationResult = ProductStatusValueObject.validate(
      ProductStatus.APPROVED,
    );
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.exceptions).toEqual([]);
  });

  it('should not validate an invalid ProductStatusValueObject', () => {
    const validationResult = ProductStatusValueObject.validate('invalid');
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.exceptions).toEqual(
      expect.arrayContaining([new ArgumentDoestNotIncludeInAllowedValues()]),
    );
  });

  it('should have all product statuses in ProductStatusArray', () => {
    expect(ProductStatusArray).toEqual(
      expect.arrayContaining([
        ProductStatus.DRAFT,
        ProductStatus.PENDING_APPROVAL,
        ProductStatus.APPROVED,
        ProductStatus.REJECTED,
      ]),
    );
  });

  it('should create a pending ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.pending();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatus.PENDING_APPROVAL);
  });

  it('should create an approved ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.approved();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatus.APPROVED);
  });

  it('should create a rejected ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.rejected();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatus.REJECTED);
  });

  it('should create a draft ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.draft();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatus.DRAFT);
  });
});
