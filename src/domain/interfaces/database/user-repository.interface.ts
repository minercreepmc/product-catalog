import { UserAggregate } from '@aggregates/user';
import { UserNameValueObject } from '@value-objects/user';
import { RepositoryPort } from './repository.port';

export interface UserRepositoryPort extends RepositoryPort<UserAggregate> {
  findOneByUsername(username: UserNameValueObject): Promise<UserAggregate>;
}

export const userRepositoryDiToken = Symbol('USER_REPOSITORY');
