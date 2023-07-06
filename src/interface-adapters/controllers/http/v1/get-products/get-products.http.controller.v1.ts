import { HttpGetControllerBase } from '@base/interface-adapters/http/get-controller.base';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ProductQuery } from '@use-cases/query/product';
import { V1GetProductsHttpRequest } from './get-products.http.request.v1';
import { V1GetProductsHttpResponse } from './get-products.http.response.v1';

@Controller('/api/v1/products/get')
export class V1GetProductsHttpController extends HttpGetControllerBase<V1GetProductsHttpRequest> {
  @Post()
  @HttpCode(HttpStatus.OK)
  execute(
    @Body()
    httpRequest: V1GetProductsHttpRequest,
  ): Promise<V1GetProductsHttpResponse> {
    return super.execute(httpRequest);
  }

  createQuery(httpRequest: V1GetProductsHttpRequest): ProductQuery {
    return new ProductQuery(httpRequest);
  }

  constructor(queryBus: QueryBus) {
    super(queryBus);
  }
}
