import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateCategoryCommand,
  CreateCategoryResponseDto,
} from '@use-cases/command/create-category';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { MultipleExceptions } from '@base/domain';
import { match } from 'oxide.ts';
import { V1CreateCategoryHttpRequest } from './create-category.http.request.v1';
import { V1CreateCategoryHttpResponse } from './create-category.http.response.v1';
import {
  HttpControllerBase,
  HttpControllerBaseOption,
} from '@base/inteface-adapters/post-http-controller.base';

@Controller('/api/v1/categories/create')
export class V1CreateCategoryHttpController extends HttpControllerBase<
  V1CreateCategoryHttpRequest,
  CreateCategoryCommand,
  V1CreateCategoryHttpResponse
> {
  @Post()
  async execute(@Body() request: V1CreateCategoryHttpRequest) {
    return super._execute({
      request,
    });
  }

  toCommand(
    options: HttpControllerBaseOption<V1CreateCategoryHttpRequest>,
  ): CreateCategoryCommand {
    const { request } = options;
    const { name, description } = request;
    return new CreateCategoryCommand({
      name: name && new CategoryNameValueObject(name),
      description:
        description && new CategoryDescriptionValueObject(description),
    });
  }
  validate(command: CreateCategoryCommand): void {
    const exceptions = command.validate();

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }
  }

  extractResult(result: any): V1CreateCategoryHttpResponse {
    return match(result, {
      Ok: (response: CreateCategoryResponseDto) =>
        new V1CreateCategoryHttpResponse(response),
      Err: (e: Error) => {
        if (e instanceof MultipleExceptions) {
          throw new ConflictException(e.exceptions);
        }

        throw e;
      },
    });
  }

  constructor(commandBus: CommandBus) {
    super(commandBus);
  }
}
