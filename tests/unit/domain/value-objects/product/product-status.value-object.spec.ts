import {
  ProductStatusEnum,
  ProductStatusArray,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ArgumentDoestNotIncludeInAllowedValues } from 'common-base-classes';

describe('ProductStatusValueObject', () => {
  it('should create a valid ProductStatusValueObject', () => {
    const productStatus = new ProductStatusValueObject(
      ProductStatusEnum.APPROVED,
    );
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatusEnum.APPROVED);
  });

  it('should throw an error for an invalid ProductStatusValueObject', () => {
    expect(
      () =>
        new ProductStatusValueObject('invalid' as unknown as ProductStatusEnum),
    ).toThrowError();
  });

  it('should validate a valid ProductStatusValueObject', () => {
    const validationResult = ProductStatusValueObject.validate(
      ProductStatusEnum.APPROVED,
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
        ProductStatusEnum.INITIAL,
        ProductStatusEnum.DRAFT,
        ProductStatusEnum.PENDING_APPROVAL,
        ProductStatusEnum.APPROVED,
        ProductStatusEnum.REJECTED,
      ]),
    );
  });

  it('should create a pending ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.createPending();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatusEnum.PENDING_APPROVAL);
  });

  it('should create an approved ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.createApproved();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatusEnum.APPROVED);
  });

  it('should create a rejected ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.createRejected();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatusEnum.REJECTED);
  });

  it('should create a draft ProductStatusValueObject', () => {
    const productStatus = ProductStatusValueObject.createDraft();
    expect(productStatus).toBeInstanceOf(ProductStatusValueObject);
    expect(productStatus.unpack()).toBe(ProductStatusEnum.DRAFT);
  });

  it('should check if the ProductStatus is INITIAL', () => {
    const productStatus = new ProductStatusValueObject(
      ProductStatusEnum.INITIAL,
    );
    expect(productStatus.isInitial()).toBe(true);
  });

  it('should check if the ProductStatus is DRAFT', () => {
    const productStatus = new ProductStatusValueObject(ProductStatusEnum.DRAFT);
    expect(productStatus.isDraft()).toBe(true);
  });

  it('should check if the ProductStatus is PENDING_APPROVAL', () => {
    const productStatus = new ProductStatusValueObject(
      ProductStatusEnum.PENDING_APPROVAL,
    );
    expect(productStatus.isPendingApproval()).toBe(true);
  });

  it('should check if the ProductStatus is APPROVED', () => {
    const productStatus = new ProductStatusValueObject(
      ProductStatusEnum.APPROVED,
    );
    expect(productStatus.isApproved()).toBe(true);
  });

  it('should check if the ProductStatus is REJECTED', () => {
    const productStatus = new ProductStatusValueObject(
      ProductStatusEnum.REJECTED,
    );
    expect(productStatus.isRejected()).toBe(true);
  });
});
