import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetCategoryQuery,
  GetCategoryResponseDto,
} from '@use-cases/query/category/get-category';
import { v1ApiEndpoints } from '../endpoint.v1';

export type V1GetCategoryHttpResponse = GetCategoryResponseDto;
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
