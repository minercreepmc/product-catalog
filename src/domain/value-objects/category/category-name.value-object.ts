import { ValueObjectBase } from '@base/domain/value-object.base';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class CategoryNameValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(2, 50)
  readonly value: string;

  static create(value: string) {
    const name = new CategoryNameValueObject(value);

    const exception = name.validate();
    if (exception) {
      throw exception;
    }

    return name;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new CategoryDomainExceptions.NameDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
