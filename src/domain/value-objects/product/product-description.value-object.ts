import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsOptional, IsString, Length, validateSync } from 'class-validator';

export class ProductDescriptionValueObject {
  @IsOptional()
  @IsString()
  @Length(5, 500)
  readonly value: string;

  static create(value?: string) {
    const description = new ProductDescriptionValueObject(value);

    const exception = description.validate();
    if (exception) {
      throw exception;
    }

    return description;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new ProductDomainExceptions.DescriptionDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
