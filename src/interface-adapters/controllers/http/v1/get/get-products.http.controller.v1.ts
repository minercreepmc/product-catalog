import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetProductsQuery,
  GetProductsResponseDto,
} from '@use-cases/query/product';
import { plainToInstance } from 'class-transformer';
import { v1ApiEndpoints } from '../endpoint.v1';

export class V1GetProductsHttpQuery extends GetProductsQuery {}
export type V1GetProductsHttpResponse = GetProductsResponseDto;

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
