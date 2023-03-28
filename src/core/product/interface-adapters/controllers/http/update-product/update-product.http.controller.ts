import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from '@product-use-case/update-product/dtos';
import { match } from 'oxide.ts';
import { UpdateProductHttpRequest } from './update-product.http.request';
import { UpdateProductHttpResponse } from './update-product.http.response';

@Controller('update-product')
export class UpdateProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() dto: UpdateProductHttpRequest) {
    const command = new UpdateProductCommand(dto);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: UpdateProductResponseDto) =>
        new UpdateProductHttpResponse(response),
      Err: (errors: Error) => {
        throw errors;
      },
    });
  }
}
