import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, Length, validate } from 'class-validator';

export class ProductNameValueObject {
  @IsDefined()
  @IsString()
  @Length(2, 30)
  readonly value: string;

  static async create(value: string) {
    const name = new ProductNameValueObject(value);
    const exceptions = await validate(name);

    if (exceptions.length > 0) {
      throw new ProductDomainExceptions.NameDoesNotValid();
    }

    return name;
  }

  constructor(value: string) {
    this.value = value;
  }
}
