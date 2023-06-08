import { CommandBus } from '@nestjs/cqrs';
import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { V1CreateReviewerHttpRequest } from './create-reviewer.http.request';
import { match } from 'oxide.ts';
import { V1CreateReviewerHttpResponse } from './create-reviewer.http.response';
import {
  CreateReviewerCommand,
  CreateReviewerResponseDto,
} from '@use-cases/create-reviewer/dtos';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';

@Controller('/api/v1/reviewers')
export class V1CreateReviewerHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async execute(
    @Body() createReviewerHttpRequest: V1CreateReviewerHttpRequest,
  ) {
    const command = new CreateReviewerCommand(createReviewerHttpRequest);

    const result = await this.commandBus.execute(command);

    return match(result, {
      Ok: (response: CreateReviewerResponseDto) => {
        return new V1CreateReviewerHttpResponse(response);
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
