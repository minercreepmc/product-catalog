import {
  UserAddressValueObject,
  UserFullNameValueObject,
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
  fullName?: UserFullNameValueObject;
  address?: UserAddressValueObject;
}

export interface RegisterUserAggregateOptions {
  username: UserNameValueObject;
  password: UserPasswordValueObject;
  fullName?: UserFullNameValueObject;
}

export interface UpdateUserProfileAggregateOptions {
  fullName?: UserFullNameValueObject;
  address?: UserAddressValueObject;
  password?: UserPasswordValueObject;
}
