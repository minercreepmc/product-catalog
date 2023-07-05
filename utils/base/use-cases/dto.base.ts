import { Request } from 'nestjs-mediator';
import { Result } from 'oxide.ts';
import {
  UseCaseRequestValidationExceptions,
  UseCaseProcessExceptions,
} from './use-case-exceptions.base';

export abstract class RequestDtoBase<ResponseDto> extends Request<
  CommandResponseResult<ResponseDto> | QueryResponseResult<ResponseDto>
> {}

export type CommandResponseResult<ResponseDto> = Result<
  ResponseDto,
  UseCaseProcessExceptions | UseCaseRequestValidationExceptions
>;

export type QueryResponseResult<ResponseDto> = Result<
  ResponseDto,
  UseCaseRequestValidationExceptions
>;

export abstract class ResponseDtoBase {
  message?: string;
  constructor(message?: string) {
    this.message = message;
  }
}
