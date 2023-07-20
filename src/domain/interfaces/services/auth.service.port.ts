import { UserAggregate } from '@aggregates/user';
import { UserNameValueObject } from '@value-objects/user';

export const authServiceDiToken = Symbol('AUTH_SERVICE');

export interface AuthServicePort {
  handlerAuthAndSaveToDb(aggregate: UserAggregate): Promise<void>;
  isUserNameExist(name: UserNameValueObject): Promise<boolean>;
}
