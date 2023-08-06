import {
  v1ApiEndpoints,
  V1GetProductHttpQuery,
  V1GetProductHttpResponse,
} from '@api/http';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductQuery } from '@use-cases/query/product';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getProduct)
export class V1GetProductHttpController {
  @Get()
  async execute(
    @Param('id') id: string,
    @Query() { populate_details }: V1GetProductHttpQuery,
  ): Promise<V1GetProductHttpResponse> {
    const query: GetProductQuery = {
      id,
      populate_details,
    };
    const res = await this.queryBus.execute(
      plainToInstance(GetProductQuery, query),
    );
    return res;
  }

  constructor(private readonly queryBus: QueryBus) {}
}
