import { HttpPutControllerBase } from '@base/interface-adapters/http';
import { Body, Controller, Param, Put } from '@nestjs/common';
import {
  DetachSubCategoriesRequestDto,
  DetachSubCategoriesResponseDto,
} from '@use-cases/command/detach-sub-categories/dtos/detach-sub-categories.dto';
import { Mediator } from 'nestjs-mediator';
import {
  V1DetachSubCategoriesHttpRequest,
  V1DetachSubCategoriesHttpResponse,
} from './detach-sub-categories.http.dto.v1';

@Controller('/api/v1/categories/:id/detach-sub-categories')
export class V1DetachSubCategoriesHttpController extends HttpPutControllerBase<
  V1DetachSubCategoriesHttpRequest,
  V1DetachSubCategoriesHttpResponse
> {
  @Put()
  execute(
    @Body() httpRequest: V1DetachSubCategoriesHttpRequest,
    @Param('id') id: string,
  ): Promise<any> {
    return super.execute(httpRequest, id);
  }

  createDto(
    httpRequest: V1DetachSubCategoriesHttpRequest,
    id?: string,
  ): DetachSubCategoriesRequestDto {
    return new DetachSubCategoriesRequestDto({
      categoryId: id,
      subIds: httpRequest.subIds,
    });
  }
  createHttpResponse(
    response: DetachSubCategoriesResponseDto,
  ): V1DetachSubCategoriesHttpResponse {
    return new V1DetachSubCategoriesHttpResponse(response);
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }
}
