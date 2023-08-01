import {
  v1ApiEndpoints,
  V1UpdateCategoryHttpRequest,
  V1UpdateCategoryHttpResponse,
} from '@api/http';
import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters';
import {
  Body,
  ConflictException,
  Controller,
  Param,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateCategoryCommand,
  UpdateCategoryResponseDto,
} from '@use-cases/command/update-category';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { match } from 'oxide.ts';

@Controller(v1ApiEndpoints.updateCategory)
export class V1UpdateCategoryHttpController extends HttpControllerBase<
  V1UpdateCategoryHttpRequest,
  UpdateCategoryCommand,
  V1UpdateCategoryHttpResponse
> {
  constructor(commandBus: CommandBus) {
    super(commandBus);
  }

  @Put()
  execute(
    @Body() request: V1UpdateCategoryHttpRequest,
    @Param('id') id: string,
  ) {
    return super._execute({
      request,
      param: { id },
    });
  }

  toCommand({
    request,
    param,
  }: HttpControllerBaseOption<V1UpdateCategoryHttpRequest>): UpdateCategoryCommand {
    const { name, description, productIds } = request;
    return new UpdateCategoryCommand({
      id: new CategoryIdValueObject(param.id),
      name: name && new CategoryNameValueObject(name),
      description:
        description && new CategoryDescriptionValueObject(description),
      productIds:
        productIds && productIds?.map?.((p) => new ProductIdValueObject(p)),
    });
  }

  extractResult(result: any): V1UpdateCategoryHttpResponse {
    return match(result, {
      Ok: (response: UpdateCategoryResponseDto) =>
        new V1UpdateCategoryHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }
        throw e;
      },
    });
  }
}
