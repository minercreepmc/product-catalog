import { v4 as uuidv4 } from 'uuid';
import { ID } from '@base/domain';
import { IsDefined, IsString, validate } from 'class-validator';
import { CategoryDomainExceptions } from '@domain-exceptions/category';

export class CategoryIdValueObject implements ID {
  @IsDefined()
  @IsString()
  readonly value: string;

  static async create(value?: string) {
    const id = new CategoryIdValueObject(value);
    const exceptions = await validate(id);

    if (exceptions.length > 0) {
      throw new CategoryDomainExceptions.IdDoesNotValid();
    }

    return id;
  }

  constructor(value?: string) {
    this.value = value && uuidv4();
  }
}
