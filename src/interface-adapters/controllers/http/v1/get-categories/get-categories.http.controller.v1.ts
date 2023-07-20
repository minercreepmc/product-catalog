import { PaginationParams } from '@base/use-cases/query-handler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCategoriesQuery } from '@use-cases/query/category/get-categories';
import { V1GetCategoriesHttpQuery } from './get-categories.http.query.v1';

@Controller('/api/v1/categories')
export class V1GetCategoriesHttpController {
  @Get()
  execute(
    @Query() { id }: V1GetCategoriesHttpQuery,
    @Query() { limit, offset }: PaginationParams,
  ): Promise<any> {
    return this.queryBus.execute(
      new GetCategoriesQuery({
        id,
        limit,
        offset,
      }),
    );
  }

  constructor(private readonly queryBus: QueryBus) {}
}
