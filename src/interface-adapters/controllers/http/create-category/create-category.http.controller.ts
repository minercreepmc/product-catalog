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
import { CreateCategoryHttpRequest } from './create-category.http.request';
import { CreateCategoryHttpResponse } from './create-category.http.response';

@Controller('categories')
export class CreateCategoryHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() dto: CreateCategoryHttpRequest) {
    const command = new CreateCategoryCommand(dto);
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: CreateCategoryResponseDto) =>
        new CreateCategoryHttpResponse(response),
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
