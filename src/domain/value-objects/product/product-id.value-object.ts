import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class ProductIdValueObject {
  @IsDefined()
  @IsString()
  readonly value: string;

  static async create(value?: string) {
    const id = new ProductIdValueObject(value);
    const exceptions = await validate(id);

    if (exceptions.length > 0) {
      throw new ProductDomainExceptions.IdDoesNotValid();
    }

    return id;
  }

  constructor(value?: string) {
    this.value = value ?? uuidv4();
  }
}
