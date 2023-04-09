import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import {
  SubmitForApprovalCommand,
  SubmitForApprovalResponseDto,
} from '@use-cases/submit-for-approval/dtos';
import { match } from 'oxide.ts';
import { SubmitForApprovalHttpRequest } from './submit-for-approval.http.request';
import { SubmitForApprovalHttpResponse } from './submit-for-approval.http.response';

@Controller('products')
export class SubmitForApprovalHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('submit-for-approval')
  @HttpCode(200)
  async execute(@Body() dto: SubmitForApprovalHttpRequest) {
    const command = new SubmitForApprovalCommand(dto);
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: SubmitForApprovalResponseDto) =>
        new SubmitForApprovalHttpResponse(response),
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
