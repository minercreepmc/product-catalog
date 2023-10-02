import {
  userRepositoryDiToken,
  UserRepositoryPort,
} from '@application/interface/user';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserModel } from '@v2/users';

export class GetProfileQuery {
  id: string;
  constructor(options: GetProfileQuery) {
    this.id = options.id;
  }
}

export type GetProfileResponseDto = UserModel;

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler
  implements IQueryHandler<GetProfileQuery, GetProfileResponseDto | null>
{
  constructor(
    @Inject(userRepositoryDiToken)
    private readonly userRepository: UserRepositoryPort,
  ) {}
  async execute(query: GetProfileQuery): Promise<GetProfileResponseDto | null> {
    const user = await this.userRepository.findOneById(query.id);

    return user ? user : null;
  }
}
