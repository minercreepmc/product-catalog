import {
  v1ApiEndpoints,
  V1GetOrdersHttpQuery,
  V1GetOrdersHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Roles } from '@application/application-services/auth/roles';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrdersQuery } from '@use-cases/query/order';
import { UserRoleEnum } from '@value-objects/user';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getOrders)
@UseGuards(JwtAuthenticationGuard)
@Roles(UserRoleEnum.Admin)
export class V1GetOrdersHttpController {
  @Get()
  execute(
    @Query()
    { limit, offset }: V1GetOrdersHttpQuery,
  ): Promise<V1GetOrdersHttpResponse> {
    const query: GetOrdersQuery = { limit, offset };
    return this.queryBus.execute(plainToInstance(GetOrdersQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
