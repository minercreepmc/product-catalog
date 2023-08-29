import {
  v1ApiEndpoints,
  V1GetBestSellingHttpQuery,
  V1GetBestSellingHttpResponse,
} from '@api/http';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetBestSellingQuery } from '@use-cases/query/product';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getBestSelling)
export class V1GetBestSellingHttpController {
  @Get()
  execute(
    @Query() { limit, offset }: V1GetBestSellingHttpQuery,
  ): Promise<V1GetBestSellingHttpResponse> {
    const query: GetBestSellingQuery = {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    };
    return this.queryBus.execute(plainToInstance(GetBestSellingQuery, query));
  }

  constructor(private readonly queryBus: QueryBus) {}
}
