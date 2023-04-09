import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateReviewerHttpRequest } from './create-reviewer.http.request';
import { match } from 'oxide.ts';
import { CreateReviewerHttpResponse } from './create-reviewer.http.response';
import {
  CreateReviewerCommand,
  CreateReviewerResponseDto,
} from '@use-cases/create-reviewer/dtos';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';

@Controller('reviewers')
export class CreateReviewerHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(@Body() createReviewerHttpRequest: CreateReviewerHttpRequest) {
    const command = new CreateReviewerCommand(createReviewerHttpRequest);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateReviewerResponseDto) => {
        return new CreateReviewerHttpResponse(response);
      },
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
