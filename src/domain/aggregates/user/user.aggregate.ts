import { AggregateRootBase } from '@base/domain';
import {
  AdminRegisteredDomainEvent,
  MemberRegisteredDomainEvent,
  ProfileUpdatedDomainEvent,
} from '@domain-events/user';
import {
  UserAddressValueObject,
  UserFullNameValueObject,
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';
import {
  RegisterUserAggregateOptions,
  UpdateUserProfileAggregateOptions,
  UserAggregateDetails,
} from './user.aggregate.interface';

export class UserAggregate implements AggregateRootBase, UserAggregateDetails {
  constructor(options?: UserAggregateDetails) {
    if (options) {
      this.id = options.id;
      this.username = options.username;
      this.password = options.password;
      this.role = options.role;
      this.fullName = options.fullName;
    } else {
      this.id = new UserIdValueObject();
    }
  }
  username: UserNameValueObject;
  password?: UserPasswordValueObject;
  role: UserRoleValueObject;
  fullName?: UserFullNameValueObject;
  address?: UserAddressValueObject;
  id: UserIdValueObject;

  registerMember(options: RegisterUserAggregateOptions) {
    const { username, password, fullName } = options;

    this.username = username;
    this.password = password;
    this.role = UserRoleValueObject.createMember();
    this.fullName = fullName ? fullName : new UserFullNameValueObject();

    return new MemberRegisteredDomainEvent({
      id: this.id,
      username,
      role: this.role,
      fullName: this.fullName,
    });
  }

  registerAdmin(options: RegisterUserAggregateOptions) {
    const { username, password, fullName } = options;

    this.username = username;
    this.password = password;
    this.role = UserRoleValueObject.createAdmin();
    this.fullName = fullName ? fullName : new UserFullNameValueObject();

    return new AdminRegisteredDomainEvent({
      id: this.id,
      username,
      role: this.role,
      fullName: this.fullName,
    });
  }

  updateProfile(options: UpdateUserProfileAggregateOptions) {
    const { fullName, address, password } = options;

    if (fullName) {
      this.fullName = fullName;
    }

    if (address) {
      this.address = address;
    }

    if (password) {
      this.password = password;
    }

    return new ProfileUpdatedDomainEvent({
      id: this.id,
      address: this.address,
      fullName: this.fullName,
    });
  }
}
