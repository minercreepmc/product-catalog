import { AggregateRootBase, ID } from '@base/domain';
import {
  AdminRegisteredDomainEvent,
  MemberRegisteredDomainEvent,
} from '@domain-events/user';
import {
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
    } else {
      this.id = new UserIdValueObject();
    }
  }
  username: UserNameValueObject;
  password: UserPasswordValueObject;
  role: UserRoleValueObject;
  id: ID;

  registerMember(options: RegisterUserAggregateOptions) {
    const { username, password } = options;

    this.username = username;
    this.password = password;
    this.role = UserRoleValueObject.createMember();
    return new MemberRegisteredDomainEvent({
      id: this.id,
      username,
      role: this.role,
    });
  }

  registerAdmin(options: RegisterUserAggregateOptions) {
    const { username, password } = options;

    this.username = username;
    this.password = password;
    this.role = UserRoleValueObject.createAdmin();

    return new AdminRegisteredDomainEvent({
      id: this.id,
      username,
      role: this.role,
    });
  }
}
