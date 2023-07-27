import {
  v1ApiEndpoints,
  V1GetCategoriesHttpQuery,
  V1GetCategoriesHttpResponse,
} from '@api/http';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCategoriesQuery } from '@use-cases/query/category/get-categories';

@Controller(v1ApiEndpoints.getCategories)
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
