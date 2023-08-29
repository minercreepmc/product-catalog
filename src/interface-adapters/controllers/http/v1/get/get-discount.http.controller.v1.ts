import { v1ApiEndpoints, V1GetDiscountHttpResponse } from '@api/http';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetDiscountQuery } from '@use-cases/query/discount';
import { plainToInstance } from 'class-transformer';

@Controller(v1ApiEndpoints.getDiscount)
export class V1GetDiscountHttpController {
  @Get()
  execute(@Param('id') id: string): Promise<V1GetDiscountHttpResponse> {
    const query: GetDiscountQuery = {
      id,
    };
    return this.queryBus.execute(plainToInstance(GetDiscountQuery, query));
  }
  constructor(private readonly queryBus: QueryBus) {}
}
