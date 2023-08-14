import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { UserNameValueObject } from '@value-objects/user';

export class LogInCommand implements CommandBase {
  username: UserNameValueObject;

  validate?() {
    return [this.username.validate?.()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }

  constructor(options: LogInCommand) {
    this.username = options.username;
  }
}

export class LogInResponseDto {
  cookie: any;

  constructor(options: LogInResponseDto) {
    this.cookie = options.cookie;
  }
}
