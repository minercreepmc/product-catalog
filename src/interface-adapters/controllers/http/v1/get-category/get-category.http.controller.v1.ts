import { PaginationParams } from '@base/use-cases/query-handler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCategoryQuery } from '@use-cases/query/category/get-category';
import { V1GetCategoryHttpQuery } from './get-category.http.query.v1';
import { V1GetCategoryHttpResponse } from './get-category.http.response.v1';

@Controller('/api/v1/categories')
export class V1GetCategoryHttpController {
  @Get()
  execute(
    @Query() { id }: V1GetCategoryHttpQuery,
    @Query() { limit, offset }: PaginationParams,
  ): Promise<V1GetCategoryHttpResponse> {
    return this.queryBus.execute(
      new GetCategoryQuery({
        id,
        limit,
        offset,
      }),
    );
  }
  constructor(private readonly queryBus: QueryBus) {}
}
