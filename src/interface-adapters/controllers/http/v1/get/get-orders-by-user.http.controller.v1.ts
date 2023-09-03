import {
  RequestWithUser,
  v1ApiEndpoints,
  V1GetOrdersByUserHttpRequest,
  V1GetOrdersByUserHttpResponse,
} from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrdersByUserQuery } from '@use-cases/query/order';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getOrdersByUser)
@UseGuards(JwtAuthenticationGuard)
export class V1GetOrdersByUserHttpController {
  @Get()
  execute(
    @Req() req: RequestWithUser,
    @Query()
    { limit, offset }: V1GetOrdersByUserHttpRequest,
  ): Promise<V1GetOrdersByUserHttpResponse> {
    const query: GetOrdersByUserQuery = { limit, offset, userId: req.user.id };
    return this.queryBus.execute(plainToInstance(GetOrdersByUserQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
