import { ValueObjectBase } from '@base/domain/value-object.base';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class DiscountIdValueObject implements ValueObjectBase {
  @IsNotEmpty()
  @IsString()
  readonly value: string;

  static create(value?: string) {
    const id = new DiscountIdValueObject(value);
    const exception = id.validate();

    if (exception) {
      throw exception;
    }

    return id;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new DiscountDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    this.value = value || uuidv4();
  }
}
