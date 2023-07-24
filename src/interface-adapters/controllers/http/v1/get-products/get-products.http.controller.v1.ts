import { PaginationParams } from '@base/use-cases/query-handler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiQuery } from '@nestjs/swagger';
import { GetProductsQuery } from '@use-cases/query/product';
import { v1ApiEndpoints } from '../endpoint.v1';
import { V1GetProductsHttpResponse } from './get-products.http.response.v1';

@Controller(v1ApiEndpoints.getProducts)
export class V1GetProductsHttpController {
  @Get()
  @ApiQuery({ type: PaginationParams })
  execute(
    @Query() { offset, limit }: PaginationParams,
  ): Promise<V1GetProductsHttpResponse> {
    return this.queryBus.execute(
      new GetProductsQuery({
        offset,
        limit,
      }),
    );
  }

  constructor(private readonly queryBus: QueryBus) {}
}
