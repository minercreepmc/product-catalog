import { v1ApiEndpoints, V1GetCategoryHttpResponse } from '@api/http';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCategoryQuery } from '@use-cases/query/category/get-category';

@Controller(v1ApiEndpoints.getCategory)
export class V1GetCategoryHttpController {
  @Get()
  execute(@Param('id') id: string): Promise<V1GetCategoryHttpResponse> {
    return this.queryBus.execute(
      new GetCategoryQuery({
        id,
      }),
    );
  }
  constructor(private readonly queryBus: QueryBus) {}
}
