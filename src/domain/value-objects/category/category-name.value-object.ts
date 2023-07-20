import { ValueObjectBase } from '@base/domain/value-object.base';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { IsDefined, IsString, Length, validate } from 'class-validator';

export class CategoryNameValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(2, 50)
  readonly value: string;

  static async create(value: string) {
    const name = new CategoryNameValueObject(value);
    const exceptions = await validate(name);

    if (exceptions.length > 0) {
      throw new CategoryDomainExceptions.NameDoesNotValid();
    }

    return name;
  }

  constructor(value: string) {
    this.value = value;
  }
}
