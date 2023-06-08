import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Param,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApproveProductCommand,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { match } from 'oxide.ts';
import { V1ApproveProductHttpRequest } from './approve-product.http.request';
import { V1ApproveProductHttpResponse } from './approve-product.http.response';

@Controller('/api/v1/products')
export class V1ApproveProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:productId/approve')
  async execute(
    @Param('productId') productId: string,
    @Body() dto: V1ApproveProductHttpRequest,
  ) {
    const command = new ApproveProductCommand({
      productId,
      ...dto,
    });
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: ApproveProductResponseDto) =>
        new V1ApproveProductHttpResponse(response),

      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }

        if (exception instanceof UseCaseProcessExceptions) {
          throw new ConflictException(exception.exceptions);
        }

        throw new InternalServerErrorException(exception);
      },
    });
  }
}
