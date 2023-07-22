import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCategoriesQuery } from '@use-cases/query/category/get-categories';
import { V1GetCategoriesHttpQuery } from './get-categories.http.query.v1';
import { V1GetCategoriesHttpResponse } from './get-categories.http.response.v1';

@Controller('/api/v1/categories')
export class V1GetCategoriesHttpController {
  @Get()
  execute(
    @Query() { limit, offset }: V1GetCategoriesHttpQuery,
  ): Promise<V1GetCategoriesHttpResponse> {
    return this.queryBus.execute(
      new GetCategoriesQuery({
        limit,
        offset,
      }),
    );
  }

  constructor(private readonly queryBus: QueryBus) {}
}
