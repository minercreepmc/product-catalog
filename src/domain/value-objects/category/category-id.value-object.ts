import { v4 as uuidv4 } from 'uuid';
import { ID, ValueObjectBase } from '@base/domain';
import { IsDefined, IsString, validateSync } from 'class-validator';
import { CategoryDomainExceptions } from '@domain-exceptions/category';

export class CategoryIdValueObject implements ID, ValueObjectBase {
  @IsDefined()
  @IsString()
  readonly value: string;

  static create(value?: string) {
    const id = new CategoryIdValueObject(value);

    const exception = id.validate();
    if (exception) {
      throw exception;
    }

    return id;
  }

  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new CategoryDomainExceptions.IdDoesNotValid();
    }
  }

  constructor(value?: string) {
    this.value = value ?? uuidv4();
  }
}
