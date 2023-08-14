import { AggregateRootBase } from '@base/domain';
import {
  AdminRegisteredDomainEvent,
  MemberRegisteredDomainEvent,
} from '@domain-events/user';
import {
  UserFullNameValueObject,
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';
import {
  RegisterUserAggregateOptions,
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
}
