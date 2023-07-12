import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Body, Controller, Param, Put } from '@nestjs/common';
import {
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto,
} from '@use-cases/command/add-sub-categories/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1AddSubCategoriesHttpRequest } from './add-sub-categories.http.request.v1';
import { V1AddSubCategoriesHttpResponse } from './add-sub-categories.http.response.v1';

@Controller('/api/v1/categories/:id/add-sub-categories')
export class V1AddSubCategoriesHttpController extends HttpPutControllerBase<
  V1AddSubCategoriesHttpRequest,
  V1AddSubCategoriesHttpResponse
> {
  @Put()
  execute(
    @Body() httpRequest: V1AddSubCategoriesHttpRequest,
    @Param('id') id: string,
  ): Promise<any> {
    return super.execute(httpRequest, id);
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }

  createDto(
    httpRequest: V1AddSubCategoriesHttpRequest,
    id: string,
  ): AddSubCategoriesRequestDto {
    return new AddSubCategoriesRequestDto({
      categoryId: id,
      subCategoryIds: httpRequest.subCategoryIds,
    });
  }
  createHttpResponse(
    response: AddSubCategoriesResponseDto,
  ): V1AddSubCategoriesHttpResponse {
    return new V1AddSubCategoriesHttpResponse(response);
  }
}
