import { UserAggregate } from '@aggregates/user';
import {
  UserIdValueObject,
  UserNameValueObject,
  UserPasswordValueObject,
} from '@value-objects/user';

export const authServiceDiToken = Symbol('AUTH_SERVICE');

export interface AuthServicePort {
  handlerAuthAndSaveToDb(aggregate: UserAggregate): Promise<void>;
  handleAuthAndUpdateToDb(aggregate: UserAggregate): Promise<void>;
  doesUserNameExist(name: UserNameValueObject): Promise<boolean>;
  doesUserIdExist(id: UserIdValueObject): Promise<boolean>;
  isPasswordMatchByUserName(
    username: UserNameValueObject,
    password: UserPasswordValueObject,
  ): Promise<boolean>;
  findOneByUsername(
    username: UserNameValueObject,
  ): Promise<UserAggregate | null>;
  findOneById(id: UserIdValueObject): Promise<UserAggregate | null>;
  getAuthenticatedCookie(userId: UserIdValueObject): string;
  getLogOutCookie(): string;
}
