import { ValueObjectBase } from '@base/domain/value-object.base';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { IsDefined, IsString, Length, validate } from 'class-validator';

export class FileValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsDefined()
  value: Buffer;

  static async create(options: FileValueObject) {
    const file = new FileValueObject(options);
    const exceptions = await validate(file);

    if (exceptions.length > 0) {
      throw new CategoryDomainExceptions.NameDoesNotValid();
    }

    return file;
  }

  constructor(options: FileValueObject) {
    this.value = options.value;
    this.name = options.name;
  }
}
