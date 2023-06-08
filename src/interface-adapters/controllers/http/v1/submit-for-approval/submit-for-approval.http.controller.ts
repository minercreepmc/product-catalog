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
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';
import {
  SubmitForApprovalCommand,
  SubmitForApprovalResponseDto,
} from '@use-cases/submit-for-approval/dtos';
import { match } from 'oxide.ts';
import { V1SubmitForApprovalHttpRequest } from './submit-for-approval.http.request';
import { V1SubmitForApprovalHttpResponse } from './submit-for-approval.http.response';

@Controller('/api/v1/products')
export class V1SubmitForApprovalHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Put('/:productId/submit')
  async execute(
    @Param('productId') productId: string,
    @Body() dto: V1SubmitForApprovalHttpRequest,
  ) {
    const command = new SubmitForApprovalCommand({
      productId,
      ...dto,
    });
    const result = await this.commandBus.execute(command);
    return match(result, {
      Ok: (response: SubmitForApprovalResponseDto) =>
        new V1SubmitForApprovalHttpResponse(response),
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
