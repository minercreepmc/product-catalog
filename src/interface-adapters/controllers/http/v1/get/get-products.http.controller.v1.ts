import {
  v1ApiEndpoints,
  V1GetProductsHttpQuery,
  V1GetProductsHttpResponse,
} from '@api/http';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductsQuery } from '@use-cases/query/product';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getProducts)
export class V1GetProductsHttpController {
  @Get()
  execute(
    @Query() { discount_id, limit, offset }: V1GetProductsHttpQuery,
  ): Promise<V1GetProductsHttpResponse> {
    const query: GetProductsQuery = {
      discount_id,
      limit,
      offset,
    };
    return this.queryBus.execute(plainToInstance(GetProductsQuery, query));
  }

  constructor(private readonly queryBus: QueryBus) {}
}
