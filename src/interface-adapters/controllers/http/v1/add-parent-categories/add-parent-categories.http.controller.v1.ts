import { HttpPostControllerBase } from '@base/interface-adapters/http';
import { Controller } from '@nestjs/common';
import {
  AddParentCategoriesRequestDto,
  AddParentCategoriesResponseDto,
} from '@use-cases/command/add-parent-categories/dtos';
import { Mediator } from 'nestjs-mediator';
import { V1AddParentCategoriesHttpRequest } from './add-parent-categories.http.request.v1';
import { V1AddParentCategoriesHttpResponse } from './add-parent-categories.http.response.v1';

@Controller('/api/v1/categories/parent')
export class V1AddParentCategoriesHttpController extends HttpPostControllerBase<
  V1AddParentCategoriesHttpRequest,
  V1AddParentCategoriesHttpResponse
> {
  constructor(mediator: Mediator) {
    super(mediator);
  }

  createDto(
    httpRequest: V1AddParentCategoriesHttpRequest,
  ): AddParentCategoriesRequestDto {
    return new AddParentCategoriesRequestDto(httpRequest);
  }
  createHttpResponse(
    response: AddParentCategoriesResponseDto,
  ): V1AddParentCategoriesHttpResponse {
    return new V1AddParentCategoriesHttpResponse(response);
  }
}
