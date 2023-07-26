import { CommandBase } from '@base/use-cases';
import {
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export class RegisterMemberCommand implements CommandBase {
  username: UserNameValueObject;
  password: UserPasswordValueObject;

  validate?() {
    return [this.username.validate(), this.password.validate()].filter(
      (e) => e,
    );
  }

  constructor(dtos: RegisterMemberCommand) {
    this.username = dtos.username;
    this.password = dtos.password;
  }
}

export class RegisterMemberResponseDto {
  username: string;
  constructor(dtos: RegisterMemberResponseDto) {
    this.username = dtos.username;
  }
}
