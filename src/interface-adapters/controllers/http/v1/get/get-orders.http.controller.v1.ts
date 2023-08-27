import {
  RequestWithUser,
  v1ApiEndpoints,
  V1GetOrdersHttpQuery,
  V1GetOrdersHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrdersQuery } from '@use-cases/query/order';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getOrders)
@UseGuards(JwtAuthenticationGuard)
export class V1GetOrdersHttpController {
  @Get()
  execute(
    @Req() req: RequestWithUser,
    @Query()
    { limit, offset }: V1GetOrdersHttpQuery,
  ): Promise<V1GetOrdersHttpResponse> {
    const query: GetOrdersQuery = { userId: req.user.id, limit, offset };
    return this.queryBus.execute(plainToInstance(GetOrdersQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
