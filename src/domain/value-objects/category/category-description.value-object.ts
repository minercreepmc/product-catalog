import { ValueObjectBase } from '@base/domain/value-object.base';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { IsDefined, IsString, Length, validate } from 'class-validator';

export class CategoryDescriptionValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(5, 100)
  readonly value: string;

  static async create(value: string) {
    const description = new CategoryDescriptionValueObject(value);
    const exceptions = await validate(description);

    if (exceptions.length > 0) {
      throw new CategoryDomainExceptions.DescriptionDoesNotValid();
    }

    return description;
  }

  constructor(value: string) {
    this.value = value;
  }
}
