import { ValueObjectBase } from '@base/domain';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { IsDefined, IsEnum, validate } from 'class-validator';

export enum UserRoleEnum {
  Member = 'member',
  Admin = 'admin',
}

export const reviewerRoles = Object.values(UserRoleEnum);

export class UserRoleValueObject implements ValueObjectBase {
  @IsDefined()
  @IsEnum(UserRoleEnum)
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static async create(value: string): Promise<UserRoleValueObject> {
    const userRole = new UserRoleValueObject(value);
    const exceptions = await validate(userRole);

    if (exceptions.length > 0) {
      throw new UserDomainExceptions.RoleDoesNotValid();
    }

    return userRole;
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
