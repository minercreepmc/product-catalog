import { ValueObjectBase } from '@base/domain/value-object.base';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class DiscountNameValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(5, 255)
  readonly value: string;

  static create(value: string) {
    const name = new DiscountNameValueObject(value);
    const exception = name.validate();

    if (exception) {
      throw exception;
    }

    return name;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new DiscountDomainExceptions.NameDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
