import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetProductQuery,
  GetProductResponseDto,
} from '@use-cases/query/product';
import { plainToInstance } from 'class-transformer';
import { v1ApiEndpoints } from '../endpoint.v1';

export class V1GetProductHttpQuery extends GetProductQuery {}
export type V1GetProductHttpResponse = GetProductResponseDto;
@Controller(v1ApiEndpoints.getProduct)
export class V1GetProductHttpController {
  @Get()
  async execute(
    @Param('id') id: string,
    @Query() { populate_discount, populate_details }: V1GetProductHttpQuery,
  ) {
    const query: GetProductQuery = {
      id,
      populate_discount,
      populate_details,
    };
    const res = await this.queryBus.execute(
      plainToInstance(GetProductQuery, query),
    );
    return res;
  }

  constructor(private readonly queryBus: QueryBus) {}
}
