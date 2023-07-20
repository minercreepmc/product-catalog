import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
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
import { validate } from 'class-validator';
import { DomainExceptionBase } from '@base/domain';
import { match } from 'oxide.ts';
import { V1CreateCategoryHttpRequest } from './create-category.http.request.v1';
import { V1CreateCategoryHttpResponse } from './create-category.http.response.v1';

@Controller('/api/v1/categories/create')
export class V1CreateCategoryHttpController {
  @Post()
  async execute(@Body() request: V1CreateCategoryHttpRequest) {
    const command = new CreateCategoryCommand({
      name: new CategoryNameValueObject(request.name),
      description: new CategoryDescriptionValueObject(request.description),
    });

    const exceptions = await validate(command);

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateCategoryResponseDto) =>
        new V1CreateCategoryHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof DomainExceptionBase) {
          throw new ConflictException(exception.message);
        }

        throw new InternalServerErrorException(exception.message);
      },
    });
  }

  constructor(private readonly commandBus: CommandBus) {}
}
