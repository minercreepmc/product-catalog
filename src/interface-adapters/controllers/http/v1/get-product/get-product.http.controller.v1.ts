import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetProductQuery,
  GetProductResponseDto,
} from '@use-cases/query/product';
import { v1ApiEndpoints } from '../endpoint.v1';

export class V1GetProductHttpRequest extends GetProductQuery {}
export class V1GetProductHttpResponse extends GetProductResponseDto {}
@Controller(v1ApiEndpoints.getProduct)
export class V1GetProductHttpController {
  @Get()
  execute(@Param('id') id: string) {
    const getProductQuery = new GetProductQuery({
      id,
    });
    return this.queryBus.execute(getProductQuery);
  }

  constructor(private readonly queryBus: QueryBus) {}
}
