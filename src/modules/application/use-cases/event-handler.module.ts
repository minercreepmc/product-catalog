import { DomainServicesModule } from '@modules/domains';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MemberRegisteredEventHandler } from '@use-cases/event-handlers';

@Module({
  imports: [CqrsModule, DomainServicesModule],
  providers: [MemberRegisteredEventHandler],
})
export class EventHandlerModule {}
