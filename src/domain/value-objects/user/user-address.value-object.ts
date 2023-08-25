import { DomainExceptionBase, ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { IsDefined, IsNotEmpty, IsString, validateSync } from 'class-validator';

export class UserAddressValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  value: string;

  validate?(): DomainExceptionBase | undefined {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new UserDomainExceptions.UsernameDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
