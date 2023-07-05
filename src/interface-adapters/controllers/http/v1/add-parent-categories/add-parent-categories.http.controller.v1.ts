import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  AddParentCategoriesRequestDto,
  AddParentCategoriesResponseDto,
} from '@use-cases/command/add-parent-categories/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1AddParentCategoriesHttpRequest } from './add-parent-categories.http.request.v1';
import { V1AddParentCategoriesHttpResponse } from './add-parent-categories.http.response.v1';

@Controller('/api/v1/categories/:id/add-parent-categories')
export class V1AddParentCategoriesHttpController extends HttpPutControllerBase<
  V1AddParentCategoriesHttpRequest,
  V1AddParentCategoriesHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }

  createDto(
    httpRequest: V1AddParentCategoriesHttpRequest,
    id: string,
  ): AddParentCategoriesRequestDto {
    return new AddParentCategoriesRequestDto({
      categoryId: id,
      parentIds: httpRequest.parentIds,
    });
  }
  createHttpResponse(
    response: AddParentCategoriesResponseDto,
  ): V1AddParentCategoriesHttpResponse {
    return new V1AddParentCategoriesHttpResponse(response);
  }
}
