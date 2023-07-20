import { DomainExceptionBase } from '@base/domain';
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from '@use-cases/command/remove-categories';
import { CategoryIdValueObject } from '@value-objects/category';
import { validate } from 'class-validator';
import { match } from 'oxide.ts';
import { V1RemoveCategoriesHttpRequest } from './remove-categories.http.request.v1';
import { V1RemoveCategoriesHttpResponse } from './remove-categories.http.response.v1';

@Controller('/api/v1/categories/remove')
export class V1RemoveCategoriesHttpController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async execute(@Body() request: V1RemoveCategoriesHttpRequest): Promise<any> {
    const command = new RemoveCategoriesCommand({
      ids: request.ids.map((id) => new CategoryIdValueObject(id)),
    });

    const exceptions = await validate(command);

    if (exceptions.length > 0) {
      throw new UnprocessableEntityException(exceptions);
    }

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: RemoveCategoriesResponseDto) =>
        new V1RemoveCategoriesHttpResponse(response),
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
