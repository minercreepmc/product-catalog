import { GenericDomainExceptions } from '@domain-exceptions';
import { IsDefined, IsString, IsUrl, validateSync } from 'class-validator';

export class ImageUrlValueObject {
  @IsDefined()
  @IsString()
  @IsUrl()
  readonly value: string;

  validate() {
    const exceptions = validateSync(this);
    if (exceptions.length > 0) {
      return new GenericDomainExceptions.ImageUrlDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
