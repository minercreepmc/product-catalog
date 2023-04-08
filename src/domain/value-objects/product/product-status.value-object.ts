import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export enum ProductStatusEnum {
  INITIAL = 'initial',
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const ProductStatusArray = Object.keys(ProductStatusEnum).map(
  (key) => ProductStatusEnum[key],
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

  static initial(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.INITIAL);
  }

  static pending(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.PENDING_APPROVAL);
  }

  static approved(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.APPROVED);
  }

  static rejected(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.REJECTED);
  }

  static draft(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.DRAFT);
  }
}
