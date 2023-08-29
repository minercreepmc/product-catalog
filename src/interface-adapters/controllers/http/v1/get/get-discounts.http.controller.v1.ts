import {
  v1ApiEndpoints,
  V1GetDiscountsHttpQuery,
  V1GetDiscountsHttpResponse,
} from '@api/http';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetDiscountsQuery } from '@use-cases/query/discount';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getDiscounts)
export class V1GetDiscountsHttpController {
  @Get()
  execute(
    @Query() { limit, offset }: V1GetDiscountsHttpQuery,
  ): Promise<V1GetDiscountsHttpResponse> {
    const query: GetDiscountsQuery = { offset, limit };
    return this.queryBus.execute(plainToInstance(GetDiscountsQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
