import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Param,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from '@use-cases/update-product/dtos';
import { match } from 'oxide.ts';
import { V1UpdateProductHttpRequest } from './update-product.http.request';
import { V1UpdateProductHttpResponse } from './update-product.http.response';

@Controller('/api/v1/products')
export class V1UpdateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put(':productId')
  async execute(
    @Param('productId') productId: string,
    @Body() dto: V1UpdateProductHttpRequest,
  ) {
    const command = new UpdateProductCommand({
      productId,
      ...dto,
    });

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: UpdateProductResponseDto) =>
        new V1UpdateProductHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }

        if (exception instanceof UseCaseProcessExceptions) {
          throw new ConflictException(exception.exceptions);
        }

        throw new BadRequestException(exception);
      },
    });
  }
}
