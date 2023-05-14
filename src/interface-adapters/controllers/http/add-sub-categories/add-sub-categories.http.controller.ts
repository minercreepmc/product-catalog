import {
  Body,
  ConflictException,
  Controller,
  Param,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AddSubCategoriesCommand,
  AddSubCategoriesResponseDto,
} from '@use-cases/add-sub-categories/dtos';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { match } from 'oxide.ts';
import { AddSubCategoriesHttpRequest } from './add-sub-categories.http.request';
import { AddSubCategoriesHttpResponse } from './add-sub-categories.http.response';

@Controller('categories')
export class AddSubCategoriesHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:categoryId/add-sub-categories')
  async execute(
    @Param('categoryId') categoryId: string,
    @Body() dto: AddSubCategoriesHttpRequest,
  ) {
    const command = new AddSubCategoriesCommand({
      categoryId,
      subCategoryIds: dto.subCategoryIds,
    });
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: AddSubCategoriesResponseDto) =>
        new AddSubCategoriesHttpResponse(response),
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
