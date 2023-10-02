import { PaginationParams } from '@api/http';
import { ApplicationRepositoryPort } from '@base/use-cases';
import { UserModel } from '@v2/users';

export const userRepositoryDiToken = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort
  extends ApplicationRepositoryPort<UserModel> {
  findOneByName(name: string): Promise<UserModel | null>;
  findAll(filter?: PaginationParams): Promise<UserModel[]>;
}
