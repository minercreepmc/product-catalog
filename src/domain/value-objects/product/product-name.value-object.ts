import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class ProductNameValueObject {
  @IsDefined()
  @IsString()
  @Length(2, 30)
  readonly value: string;

  static create(value: string) {
    const name = new ProductNameValueObject(value);
    const exception = name.validate();

    if (exception) {
      throw exception;
    }

    return name;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new ProductDomainExceptions.NameDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
