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
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from '@use-cases/update-product/dtos';
import { match } from 'oxide.ts';
import { UpdateProductHttpRequest } from './update-product.http.request';
import { UpdateProductHttpResponse } from './update-product.http.response';

@Controller('products')
export class UpdateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put(':productId')
  async execute(
    @Param('productId') productId: string,
    @Body() dto: UpdateProductHttpRequest,
  ) {
    const command = new UpdateProductCommand({
      productId,
      ...dto,
    });

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: UpdateProductResponseDto) =>
        new UpdateProductHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }

        if (exception instanceof UseCaseBusinessValidationExceptions) {
          throw new ConflictException(exception.exceptions);
        }

        throw new BadRequestException(exception);
      },
    });
  }
}
