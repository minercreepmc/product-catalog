import { HttpGetControllerBase } from '@base/interface-adapters/http/get-controller.base';
import { Body, Controller, Param, Put } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetSubCategoriesQuery } from '@use-cases/query/category/get-sub-categories';
import { V1GetSubCategoriesHttpRequest } from './get-sub-categories.http.request.v1';
import { V1GetSubCategoriesHttpResponse } from './get-sub-categories.http.response.v1';

@Controller('/api/v1/categories/:id/get-sub-categories')
export class V1GetSubCategoriesHttpController extends HttpGetControllerBase<V1GetSubCategoriesHttpRequest> {
  createQuery(
    httpRequest: V1GetSubCategoriesHttpRequest,
    id: string,
  ): GetSubCategoriesQuery {
    return new GetSubCategoriesQuery({
      where: {
        id,
      },
      ...httpRequest,
    });
  }

  @Put()
  execute(
    @Body() httpRequest: V1GetSubCategoriesHttpRequest,
    @Param('id') id: string,
  ): Promise<V1GetSubCategoriesHttpResponse> {
    return super.execute(httpRequest, id);
  }

  constructor(queryBus: QueryBus) {
    super(queryBus);
  }
}
