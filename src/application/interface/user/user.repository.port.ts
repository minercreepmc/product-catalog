import { ApplicationRepositoryPort } from '@base/use-cases';
import { UserSchema } from '@database/repositories/pg/user';

export const userRepositoryDiToken = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort
  extends ApplicationRepositoryPort<UserSchema> {
  findOneByName(name: string): Promise<UserSchema>;
}
