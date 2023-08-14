import { ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { IsDefined, IsString, Length, validateSync } from 'class-validator';

export class UserFullNameValueObject implements ValueObjectBase {
  @IsDefined()
  @IsString()
  @Length(2, 50)
  readonly value: string;

  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new UserDomainExceptions.UsernameDoesNotValid();
    }
  }

  constructor(value?: string) {
    this.value = value || 'Default User';
  }
}
