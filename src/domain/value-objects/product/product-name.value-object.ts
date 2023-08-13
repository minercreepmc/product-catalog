import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class ProductNameValueObject {
  @IsDefined()
  @IsString()
  @Length(2, 250)
  readonly value: string;

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
