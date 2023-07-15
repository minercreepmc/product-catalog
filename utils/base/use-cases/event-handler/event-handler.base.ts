import {
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { INotificationHandler, Mediator } from 'nestjs-mediator';
import {  Result } from 'oxide.ts';
import {
  UseCaseProcessExceptions,
  UseCaseRequestValidationExceptions,
} from '../use-case-exceptions.base';

export abstract class EventHandlerBase<TEvent>
  implements INotificationHandler<TEvent>
{
  constructor(protected readonly mediator: Mediator) {}

  abstract handle(event: TEvent): void | Promise<void>;

  protected handlerException(result: Result<any, any>): void {
    if (result.isErr()) {
      if (result.unwrapErr() instanceof UseCaseRequestValidationExceptions) {
        throw new UnprocessableEntityException(result.unwrapErr().exceptions);
      }
      if (result.unwrapErr() instanceof UseCaseProcessExceptions) {
        throw new ConflictException(result.unwrapErr().exceptions);
      }
      throw new InternalServerErrorException(result.unwrapErr());
    }
  }
}
