import { ValueObjectBase } from '@base/domain/value-object.base';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class CategoryDescriptionValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(5, 500)
  readonly value: string;

  static create(value: string) {
    const description = new CategoryDescriptionValueObject(value);

    const exception = description.validate();
    if (exception) {
      throw exception;
    }

    return description;
  }

  validate() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new CategoryDomainExceptions.DescriptionDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
