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
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@use-cases/create-product/dtos';
import { match } from 'oxide.ts';
import { CreateProductHttpRequestDto } from './create-product.http.request.dto';
import { CreateProductHttpResponse } from './create-product.http.response.dto';

@Controller('products')
export class CreateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() dto: CreateProductHttpRequestDto) {
    const command = new CreateProductCommand(dto);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateProductResponseDto) =>
        new CreateProductHttpResponse(response),
      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }
        if (exception instanceof UseCaseBusinessValidationExceptions) {
          throw new ConflictException(exception.exceptions);
        }

        throw new InternalServerErrorException(exception);
      },
    });
  }
}
