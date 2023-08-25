import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  UserAddressValueObject,
  UserFullNameValueObject,
  UserIdValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export class UpdateProfileCommand implements CommandBase {
  constructor(options: UpdateProfileCommand) {
    const { id, address, fullName } = options;
    this.id = id;
    this.address = address;
    this.fullName = fullName;
  }
  id: UserIdValueObject;
  address?: UserAddressValueObject;
  fullName?: UserFullNameValueObject;
  password?: UserPasswordValueObject;

  validate?(): DomainExceptionBase[] {
    return [this.address?.validate?.(), this.fullName?.validate?.()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }
}

export class UpdateProfileResponseDto {
  id: string;
  address?: string;
  fullName?: string;

  constructor(options: UpdateProfileResponseDto) {
    this.id = options.id;
    this.address = options.address;
    this.fullName = options.fullName;
  }
}
