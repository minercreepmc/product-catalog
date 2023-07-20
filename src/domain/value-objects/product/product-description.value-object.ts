import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, Length, validate } from 'class-validator';

export class ProductDescriptionValueObject {
  @IsDefined()
  @IsString()
  @Length(5, 500)
  readonly value: string;

  static async create(value?: string) {
    const description = new ProductDescriptionValueObject(value);
    const exceptions = await validate(description);

    if (exceptions.length > 0) {
      throw new ProductDomainExceptions.DescriptionDoesNotValid();
    }

    return description;
  }

  constructor(value: string) {
    this.value = value;
  }
}
