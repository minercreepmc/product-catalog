import { ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { IsDefined, IsEnum, validateSync } from 'class-validator';

export enum UserRoleEnum {
  Member = 'member',
  Admin = 'admin',
  Staff = 'staff',
  Shipper = 'shipper',
}

export const reviewerRoles = Object.values(UserRoleEnum);

export class UserRoleValueObject implements ValueObjectBase {
  @IsDefined()
  @IsEnum(UserRoleEnum)
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new UserDomainExceptions.RoleDoesNotValid();
    }
  }

  isAdmin(): boolean {
    return this.value === UserRoleEnum.Admin;
  }

  isMember(): boolean {
    return this.value === UserRoleEnum.Member;
  }

  static createAdmin(): UserRoleValueObject {
    return new UserRoleValueObject(UserRoleEnum.Admin);
  }

  static createMember(): UserRoleValueObject {
    return new UserRoleValueObject(UserRoleEnum.Member);
  }
}
