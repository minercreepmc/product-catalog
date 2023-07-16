import { INotificationHandler, Mediator } from 'nestjs-mediator';
import { Result } from 'oxide.ts';

export abstract class EventHandlerBase<TEvent>
  implements INotificationHandler<TEvent>
{
  constructor(protected readonly mediator: Mediator) {}

  abstract handle(event: TEvent): void | Promise<void>;

  protected handlerException(result: Result<any, any>): void {
    if (result.isErr()) {
      throw result.unwrapErr();
    }
  }
}
