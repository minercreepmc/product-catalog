import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export class RegisterMemberCommand implements CommandBase {
  username: UserNameValueObject;
  password: UserPasswordValueObject;

  validate?() {
    return [this.username.validate?.(), this.password.validate?.()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }

  constructor(dtos: RegisterMemberCommand) {
    this.username = dtos.username;
    this.password = dtos.password;
  }
}

export class RegisterMemberResponseDto {
  id: string;
  username: string;
  constructor(dtos: RegisterMemberResponseDto) {
    this.id = dtos.id;
    this.username = dtos.username;
  }
}
