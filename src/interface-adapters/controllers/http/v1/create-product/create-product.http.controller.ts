import {
  Controller,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@use-cases/create-product/dtos';
import { match } from 'oxide.ts';
import { V1CreateProductHttpRequest } from './create-product.http.request';
import { V1CreateProductHttpResponse } from './create-product.http.response';

@Controller('/api/v1/products')
export class V1CreateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() dto: V1CreateProductHttpRequest) {
    const command = new CreateProductCommand(dto);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateProductResponseDto) =>
        new V1CreateProductHttpResponse(response),
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
