import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserModel } from '@v2/users/model';

export class GetUsersQuery {
  limit?: number;
  offset?: number;
  constructor(options: GetUsersQuery) {
    this.limit = options.limit;
    this.offset = options.offset;
  }
}
export type GetUsersResponse = {
  users: UserModel[];
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
    const founds: UserModel[] = await this.userRepository.findAll(query);
    return {
      users: founds,
    };
  }
}
