import { PaginationParams } from '@base/use-cases/query-handler';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetCategoriesQuery,
  GetCategoriesResponseDto,
} from '@use-cases/query/category/get-categories';
import { v1ApiEndpoints } from '../endpoint.v1';

export class V1GetCategoriesHttpQuery extends PaginationParams {}
export type V1GetCategoriesHttpResponse = GetCategoriesResponseDto;

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
