import { MultipleExceptions } from '@base/domain';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters/post-http-controller.base';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from '@use-cases/command/remove-categories';
import { CategoryIdValueObject } from '@value-objects/category';
import { match } from 'oxide.ts';
import { V1RemoveCategoriesHttpRequest } from './remove-categories.http.request.v1';
import { V1RemoveCategoriesHttpResponse } from './remove-categories.http.response.v1';

@Controller('/api/v1/categories/remove')
export class V1RemoveCategoriesHttpController extends HttpControllerBase<
  V1RemoveCategoriesHttpRequest,
  RemoveCategoriesCommand,
  V1RemoveCategoriesHttpResponse
> {
  toCommand(
    options: HttpControllerBaseOption<V1RemoveCategoriesHttpRequest>,
  ): RemoveCategoriesCommand {
    const { request } = options;
    const { ids } = request;
    return new RemoveCategoriesCommand({
      ids: ids && ids.map((id) => new CategoryIdValueObject(id)),
    });
  }
  validate(command: RemoveCategoriesCommand): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }
  }
  extractResult(result: any): V1RemoveCategoriesHttpResponse {
    return match(result, {
      Ok: (response: RemoveCategoriesResponseDto) =>
        new V1RemoveCategoriesHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(@Body() request: V1RemoveCategoriesHttpRequest): Promise<any> {
    return super._execute({
      request,
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
