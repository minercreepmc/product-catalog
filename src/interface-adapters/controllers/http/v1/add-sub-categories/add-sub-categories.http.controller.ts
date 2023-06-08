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
import { V1AddSubCategoriesHttpRequest } from './add-sub-categories.http.request';
import { V1AddSubCategoriesHttpResponse } from './add-sub-categories.http.response';

@Controller('/api/v1/categories')
export class V1AddSubCategoriesHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:categoryId/add-sub-categories')
  async execute(
    @Param('categoryId') categoryId: string,
    @Body() dto: V1AddSubCategoriesHttpRequest,
  ) {
    const command = new AddSubCategoriesCommand({
      categoryId,
      subCategoryIds: dto.subCategoryIds,
    });
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: AddSubCategoriesResponseDto) =>
        new V1AddSubCategoriesHttpResponse(response),
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
