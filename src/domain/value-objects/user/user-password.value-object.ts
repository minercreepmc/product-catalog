import { ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  IsDefined,
  IsString,
  IsStrongPassword,
  validateSync,
} from 'class-validator';

export class UserPasswordValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  readonly value: string;

  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new UserDomainExceptions.PasswordDoesNotValid();
    }
  }

  constructor(value: string) {
    this.value = value;
  }
}
