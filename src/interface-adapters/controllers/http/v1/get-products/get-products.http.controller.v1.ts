import { PaginationParams } from '@base/use-cases/query-handler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiQuery } from '@nestjs/swagger';
import { GetProductsQuery } from '@use-cases/query/product/get-products';
import { V1GetProductsHttpResponse } from './get-products.http.response.v1';

@Controller('/api/v1/products')
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
