import { ValueObjectBase } from '@base/domain/value-object.base';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { IsNotEmpty, IsString, validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class DiscountIdValueObject implements ValueObjectBase {
  @IsNotEmpty()
  @IsString()
  readonly value: string;

  static async create(value?: string) {
    const id = new DiscountIdValueObject(value);
    const exceptions = await validate(id);

    if (exceptions.length > 0) {
      throw new CategoryDomainExceptions.IdDoesNotValid();
    }

    return id;
  }

  constructor(value?: string) {
    this.value = value || uuidv4();
  }
}
