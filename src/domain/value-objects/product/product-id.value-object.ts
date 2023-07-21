import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsString, validateSync } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class ProductIdValueObject {
  @IsDefined()
  @IsString()
  readonly value: string;

  static async create(value?: string) {
    const id = new ProductIdValueObject(value);

    const exception = id.validate();
    if (exception) {
      throw exception;
    }

    return id;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new ProductDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    this.value = value ?? uuidv4();
  }
}
