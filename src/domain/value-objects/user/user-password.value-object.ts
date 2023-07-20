import { ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  IsDefined,
  IsString,
  IsStrongPassword,
  validate,
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

  static async create(value: string) {
    const password = new UserPasswordValueObject(value);
    const exceptions = await validate(password);

    if (exceptions.length > 0) {
      throw new UserDomainExceptions.PasswordDoesNotValid();
    }

    return password;
  }

  constructor(value: string) {
    this.value = value;
  }
}
