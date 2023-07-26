import { EventBus, IEventHandler } from '@nestjs/cqrs';
import { Result } from 'oxide.ts';

export abstract class EventHandlerBase<TEvent>
  implements IEventHandler<TEvent>
{
  constructor(protected readonly eventBus: EventBus) {}

  abstract handle(event: TEvent): void | Promise<void>;

  protected handlerException(result: Result<any, any>): void {
    if (result.isErr()) {
      throw result.unwrapErr();
    }
  }
}
