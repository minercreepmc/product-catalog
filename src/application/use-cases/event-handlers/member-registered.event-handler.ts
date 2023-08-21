import { MemberRegisteredDomainEvent } from '@domain-events/user';
import { CartManagementDomainService } from '@domain-services';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(MemberRegisteredDomainEvent)
export class MemberRegisteredEventHandler
  implements IEventHandler<MemberRegisteredDomainEvent>
{
  constructor(
    private readonly cartManagementService: CartManagementDomainService,
  ) {}
  async handle(event: MemberRegisteredDomainEvent) {
    const userId = event.id;
    await this.cartManagementService.createCart({
      userId,
    });
  }
}
