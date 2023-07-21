import { ValueObjectBase } from '@base/domain/value-object.base';
import { GenericDomainExceptions } from '@domain-exceptions';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class FileValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(1, 255)
  name: string;

  @IsDefined()
  value: Buffer;

  static async create(options: FileValueObject) {
    const file = new FileValueObject(options);
    const exception = validateSync(file);

    if (exception) {
      throw exception;
    }

    return file;
  }

  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new GenericDomainExceptions.FileDoesNotValid();
    }
  }

  constructor(options: FileValueObject) {
    this.value = options.value;
    this.name = options.name;
  }
}
