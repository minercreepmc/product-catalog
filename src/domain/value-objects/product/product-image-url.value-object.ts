import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, IsUrl, validate } from 'class-validator';

export class ProductImageUrlValueObject {
  @IsDefined()
  @IsString()
  @IsUrl()
  readonly value: string;

  static async create(value: string) {
    const image = new ProductImageUrlValueObject(value);
    const exceptions = await validate(image);

    if (exceptions.length > 0) {
      throw new ProductDomainExceptions.ImageDoesNotValid();
    }

    return image;
  }

  constructor(value: string) {
    this.value = value;
  }
}
