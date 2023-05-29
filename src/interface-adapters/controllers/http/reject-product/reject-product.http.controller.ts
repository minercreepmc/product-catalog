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
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import {
  RejectProductCommand,
  RejectProductResponseDto,
} from '@use-cases/reject-product/dtos';
import { match } from 'oxide.ts';
import { RejectProductHttpRequest } from './reject-product.http.request';
import { RejectProductHttpResponse } from './reject-product.http.response';

@Controller('products')
export class RejectProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:productId/reject')
  async execute(
    @Param('productId') productId: string,
    @Body() dto: RejectProductHttpRequest,
  ) {
    const command = new RejectProductCommand({
      productId,
      ...dto,
    });
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: RejectProductResponseDto) =>
        new RejectProductHttpResponse(response),
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
