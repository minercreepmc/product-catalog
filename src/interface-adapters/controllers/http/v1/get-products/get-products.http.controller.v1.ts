import { PaginationParams } from '@base/use-cases/query-handler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductsQuery } from '@use-cases/query/product/get-products';
import { V1GetProductsHttpQuery } from './get-products.http.query.v1';
import { V1GetProductsHttpResponse } from './get-products.http.response.v1';

@Controller('/api/v1/products')
export class V1GetProductsHttpController {
  @Get()
  execute(
    @Query() { id }: V1GetProductsHttpQuery,
    @Query() { offset, limit }: PaginationParams,
  ): Promise<V1GetProductsHttpResponse> {
    return this.queryBus.execute(
      new GetProductsQuery({
        id,
        offset,
        limit,
      }),
    );
  }

  constructor(private readonly queryBus: QueryBus) {}
}
