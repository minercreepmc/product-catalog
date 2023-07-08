import { HttpGetControllerBase } from '@base/interface-adapters/http/get-controller.base';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CategoryQuery } from '@use-cases/query/category';
import { V1GetCategoriesHttpRequest } from './get-categories.http.request.v1';

@Controller('/api/v1/categories/get')
export class V1GetCategoriesHttpController extends HttpGetControllerBase<V1GetCategoriesHttpRequest> {
  @Post()
  @HttpCode(HttpStatus.OK)
  execute(httpRequest: V1GetCategoriesHttpRequest): Promise<any> {
    return super.execute(httpRequest);
  }

  createQuery(httpRequest: V1GetCategoriesHttpRequest): CategoryQuery {
    return new CategoryQuery(httpRequest);
  }

  constructor(queryBus: QueryBus) {
    super(queryBus);
  }
}
