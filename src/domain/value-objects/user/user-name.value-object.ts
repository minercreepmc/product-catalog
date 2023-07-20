import { ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { IsDefined, IsString, Length, validate } from 'class-validator';

export class UserNameValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(2, 50)
  readonly value: string;

  static async create(value: string) {
    const username = new UserNameValueObject(value);
    const exceptions = await validate(username);

    if (exceptions.length > 0) {
      throw new UserDomainExceptions.UsernameDoesNotValid();
    }

    return username;
  }

  constructor(value: string) {
    this.value = value;
  }
}
