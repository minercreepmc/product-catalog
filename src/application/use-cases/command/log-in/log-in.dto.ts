import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export class LogInCommand implements CommandBase {
  username: UserNameValueObject;
  password: UserPasswordValueObject;

  validate?() {
    return [this.username.validate?.(), this.password.validate?.()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }

  constructor(options: LogInCommand) {
    this.username = options.username;
    this.password = options.password;
  }
}

export class LogInResponseDto {
  cookie: any;

  constructor(options: LogInResponseDto) {
    this.cookie = options.cookie;
  }
}
