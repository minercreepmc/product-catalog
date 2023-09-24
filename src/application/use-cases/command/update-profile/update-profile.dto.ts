import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  UserFullNameValueObject,
  UserIdValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export class UpdateProfileCommand implements CommandBase {
  constructor(options: UpdateProfileCommand) {
    const { id, fullName } = options;
    this.id = id;
    this.fullName = fullName;
  }
  id: UserIdValueObject;
  fullName?: UserFullNameValueObject;
  password?: UserPasswordValueObject;

  validate?(): DomainExceptionBase[] {
    return [this.id?.validate?.(), this.fullName?.validate?.()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }
}

export class UpdateProfileResponseDto {
  id: string;
  fullName?: string;

  constructor(options: UpdateProfileResponseDto) {
    this.id = options.id;
    this.fullName = options.fullName;
  }
}
