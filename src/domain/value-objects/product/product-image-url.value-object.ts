import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, IsUrl, validateSync } from 'class-validator';

export class ProductImageUrlValueObject {
  @IsDefined()
  @IsString()
  @IsUrl()
  readonly value: string;

  static create(value: string) {
    const image = new ProductImageUrlValueObject(value);

    const exception = image.validate();
    if (exception) {
      throw exception;
    }

    return image;
  }

  validate() {
    const exceptions = validateSync(this);
    if (exceptions.length > 0) {
      return new ProductDomainExceptions.ImageDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
