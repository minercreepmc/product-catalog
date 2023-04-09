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

  isInitial(): boolean {
    return this.unpack() === ProductStatusEnum.INITIAL;
  }

  isDraft(): boolean {
    return this.unpack() === ProductStatusEnum.DRAFT;
  }

  isPendingApproval(): boolean {
    return this.unpack() === ProductStatusEnum.PENDING_APPROVAL;
  }

  isApproved(): boolean {
    return this.unpack() === ProductStatusEnum.APPROVED;
  }

  isRejected(): boolean {
    return this.unpack() === ProductStatusEnum.REJECTED;
  }

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }

  static createInitial(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.INITIAL);
  }

  static createPending(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.PENDING_APPROVAL);
  }

  static createApproved(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.APPROVED);
  }

  static createRejected(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.REJECTED);
  }

  static createDraft(): ProductStatusValueObject {
    return new ProductStatusValueObject(ProductStatusEnum.DRAFT);
  }
}
