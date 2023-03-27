import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export enum ProductStatus {
  INITIAL = 'initial',
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const ProductStatusArray = Object.keys(ProductStatus).map(
  (key) => ProductStatus[key],
);

export class ProductStatusValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ProductStatusValueObject.OPTIONS);
  }

  static readonly OPTIONS: TextValueObjectOptions = {
    allowedValues: ProductStatusArray,
    allowEmpty: false,
    allowSymbols: true,
    allowLowercase: true,
    allowUppercase: false,
    allowNumber: false,
    allowWhitespace: false,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }

  static pending(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatus.PENDING_APPROVAL);
  }

  static approved(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatus.APPROVED);
  }

  static rejected(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatus.REJECTED);
  }

  static draft(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatus.DRAFT);
  }
}
