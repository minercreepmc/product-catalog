import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Body, Controller, Param, Put } from '@nestjs/common';
import {
  DetachParentCategoriesRequestDto,
  DetachParentCategoriesResponseDto,
} from '@use-cases/command/detach-parent-categories/dtos';
import { Mediator } from 'nestjs-mediator';
import {
  V1DetachParentCategoriesHttpRequest,
  V1DetachParentCategoriesHttpResponse,
} from './detach-parent.categories.http.dto.v1';

@Controller('/api/v1/categories/:id/detach-parent-categories')
export class V1DetachParentCategoriesHttpController extends HttpPutControllerBase<
  V1DetachParentCategoriesHttpRequest,
  V1DetachParentCategoriesHttpResponse
> {
  @Put()
  execute(
    @Body() httpRequest: V1DetachParentCategoriesHttpRequest,
    @Param('id') id?: string,
  ) {
    return super.execute(httpRequest, id);
  }

  createDto(
    httpRequest: V1DetachParentCategoriesHttpRequest,
    id?: string,
  ): DetachParentCategoriesRequestDto {
    return new DetachParentCategoriesRequestDto({
      categoryId: id,
      parentIds: httpRequest.parentIds,
    });
  }
  createHttpResponse(
    response: DetachParentCategoriesResponseDto,
  ): V1DetachParentCategoriesHttpResponse {
    return new V1DetachParentCategoriesHttpResponse(response);
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }
}
