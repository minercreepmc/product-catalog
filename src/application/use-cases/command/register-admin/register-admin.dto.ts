import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  UserFullNameValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export class RegisterAdminCommand implements CommandBase {
  username: UserNameValueObject;
  password: UserPasswordValueObject;
  fullName?: UserFullNameValueObject;

  validate?() {
    return [
      this.username.validate?.(),
      this.password.validate?.(),
      this.fullName?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }

  constructor(dtos: RegisterAdminCommand) {
    this.username = dtos.username;
    this.password = dtos.password;
    this.fullName = dtos.fullName;
  }
}

export class RegisterAdminResponseDto {
  id: string;
  username: string;
  fullName?: string;
  constructor(dtos: RegisterAdminResponseDto) {
    this.id = dtos.id;
    this.username = dtos.username;
    this.fullName = dtos.fullName;
  }
}
