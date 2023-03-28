import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@product-use-case/create-product/dtos';
import { match } from 'oxide.ts';
import { CreateProductHttpRequestDto } from './create-product.http.request.dto';
import { CreateProductHttpResponse } from './create-product.http.response.dto';

@Controller('create-product')
export class CreateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() dto: CreateProductHttpRequestDto) {
    const command = new CreateProductCommand(dto);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateProductResponseDto) =>
        new CreateProductHttpResponse(response),
      Err: (errors: Error) => {
        throw errors;
      },
    });
  }
}
