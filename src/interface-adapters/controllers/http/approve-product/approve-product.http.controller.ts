import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApproveProductCommand,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
import {
  UseCaseBusinessValidationExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import { match } from 'oxide.ts';
import { ApproveProductHttpRequest } from './approve-product.http.request';
import { ApproveProductHttpResponse } from './approve-product.http.response';

@Controller('products')
export class ApproveProductHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('approve')
  @HttpCode(200)
  async execute(@Body() dto: ApproveProductHttpRequest) {
    const command = new ApproveProductCommand(dto);
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: ApproveProductResponseDto) =>
        new ApproveProductHttpResponse(response),

      Err: (exception: Error) => {
        if (exception instanceof UseCaseCommandValidationExceptions) {
          throw new UnprocessableEntityException(exception.exceptions);
        }

        if (exception instanceof UseCaseBusinessValidationExceptions) {
          throw new ConflictException(exception.exceptions);
        }

        throw new InternalServerErrorException();
      },
    });
  }
}
