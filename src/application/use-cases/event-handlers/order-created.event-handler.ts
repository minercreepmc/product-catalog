import { OrderCreatedDomainEvent } from '@domain-events/order';
import { CartManagementDomainService } from '@domain-services';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(OrderCreatedDomainEvent)
export class OrderCreatedEventHandler
  implements IEventHandler<OrderCreatedDomainEvent>
{
  constructor(
    private readonly cartManagementService: CartManagementDomainService,
  ) {}
  async handle(event: OrderCreatedDomainEvent) {
    const userId = event.userId;
    await this.cartManagementService.updateCart({
      userId,
      payload: {
        items: new Map(),
      },
    });
  }
}
