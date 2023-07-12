import { HttpGetControllerBase } from '@base/interface-adapters/http';
import { Body, Controller, Param, Put } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import {
  GetCategoryQuery,
  GetCategoryResponseDto,
} from '@use-cases/query/category/get-category';

export class V1GetCategoryHttpRequest {
  @ApiProperty()
  fields?: string[];
}

export type V1GetCategoryHttpResponse = GetCategoryResponseDto;

@Controller('/api/v1/categories/:id/get')
export class V1GetCategoryHttpController extends HttpGetControllerBase<V1GetCategoryHttpRequest> {
  @Put()
  execute(
    @Body()
    httpRequest: V1GetCategoryHttpRequest,
    @Param('id')
    id: string,
  ): Promise<any> {
    return super.execute(httpRequest, id);
  }

  createQuery(
    httpRequest: V1GetCategoryHttpRequest,
    id: string,
  ): GetCategoryQuery {
    return new GetCategoryQuery({
      where: { id },
      ...httpRequest,
    });
  }

  constructor(queryBus: QueryBus) {
    super(queryBus);
  }
}
