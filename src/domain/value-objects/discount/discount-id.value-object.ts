import { ID } from '@base/domain';
import { ValueObjectBase } from '@base/domain/value-object.base';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { IsDefined, IsNotEmpty, IsString, validateSync } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class DiscountIdValueObject implements ValueObjectBase, ID {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
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
    console.log(this.value);
    console.log(exceptions);

    if (exceptions.length > 0) {
      return new DiscountDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    this.value = value ?? uuidv4();
  }
}
