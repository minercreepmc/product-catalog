import {
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';

export interface UserAggregateDetails {
  id: UserIdValueObject;
  username: UserNameValueObject;
  password?: UserPasswordValueObject;
  role: UserRoleValueObject;
}

export interface RegisterUserAggregateOptions {
  username: UserNameValueObject;
  password: UserPasswordValueObject;
}
