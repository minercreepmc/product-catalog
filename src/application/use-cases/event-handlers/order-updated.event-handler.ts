import { OrderUpdatedDomainEvent } from '@domain-events/order';
import { ProductManagementDomainService } from '@domain-services';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderStatusEnum } from '@value-objects/order';

@EventsHandler(OrderUpdatedDomainEvent)
export class OrderUpdatedEventHandler
  implements IEventHandler<OrderUpdatedDomainEvent>
{
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {}
  async handle(event: OrderUpdatedDomainEvent) {
    const { productIds, status } = event;

    if (status.value === OrderStatusEnum.COMPLETED) {
      productIds.map(
        async (id) => await this.productManagementService.increaseSold(id),
      );
    }
  }
}
