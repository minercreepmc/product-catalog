import {
  v1ApiEndpoints,
  V1GetCategoryHttpResponse,
  V1GetCategoryHttpQuery,
} from '@api/http';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCategoryQuery } from '@use-cases/query/category/get-category';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getCategory)
export class V1GetCategoryHttpController {
  @Get()
  execute(
    @Param('id') id: string,
    @Query() { populate_products }: V1GetCategoryHttpQuery,
  ): Promise<V1GetCategoryHttpResponse> {
    const query: GetCategoryQuery = { id, populate_products };
    return this.queryBus.execute(plainToInstance(GetCategoryQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
