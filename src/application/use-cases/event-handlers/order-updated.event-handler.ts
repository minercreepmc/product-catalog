import { OrderUpdatedDomainEvent } from '@domain-events/order';
import {
  ProductManagementDomainService,
  ProductVerificationDomainService,
} from '@domain-services';
import { IEventHandler } from '@nestjs/cqrs';

export class OrderUpdatedEventHandler
  implements IEventHandler<OrderUpdatedDomainEvent>
{
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly productVerificationService: ProductVerificationDomainService,
  ) {}
  async handle(event: OrderUpdatedDomainEvent) {
    //
  }
}
