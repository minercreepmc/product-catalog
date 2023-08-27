import { v1ApiEndpoints, V1GetUsersHttpQuery } from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Roles } from '@application/application-services/auth/roles';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '@use-cases/query/user';
import { UserRoleEnum } from '@value-objects/user';

@Controller(v1ApiEndpoints.getUsers)
@UseGuards(JwtAuthenticationGuard)
export class V1GetUsersHttpController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  @Roles(UserRoleEnum.Admin)
  async execute(@Query() { limit, offset }: V1GetUsersHttpQuery): Promise<any> {
    return this.queryBus.execute(
      new GetUsersQuery({
        limit,
        offset,
      }),
    );
  }
}
