import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';
import { UserSchema } from '@database/repositories/pg/user';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class GetUsersQuery {
  limit?: number;
  offset?: number;
  constructor(options: GetUsersQuery) {
    this.limit = options.limit;
    this.offset = options.offset;
  }
}
export type GetUsersResponse = {
  users: UserSchema[];
};

@QueryHandler(GetUsersQuery)
export class GetUsersHandler
  implements IQueryHandler<GetUsersQuery, GetUsersResponse>
{
  constructor(
    @Inject(userRepositoryDiToken)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(query: GetUsersQuery): Promise<GetUsersResponse> {
    const founds: UserSchema[] = await this.userRepository.findAll(query);
    return {
      users: founds,
    };
  }
}
