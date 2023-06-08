import {
  Body,
  ConflictException,
  Controller,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import {
  CreateCategoryCommand,
  CreateCategoryResponseDto,
} from '@use-cases/create-category/dtos';
import { match } from 'oxide.ts';
import { V1CreateCategoryHttpRequest } from './create-category.http.request';
import { V1CreateCategoryHttpResponse } from './create-category.http.response';

@Controller('/api/v1/categories')
export class V1CreateCategoryHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() dto: V1CreateCategoryHttpRequest) {
    const command = new CreateCategoryCommand(dto);
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: CreateCategoryResponseDto) =>
        new V1CreateCategoryHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }
        if (exception instanceof UseCaseProcessExceptions) {
          throw new ConflictException(exception.exceptions);
        }
        throw exception;
      },
    });
  }
}
