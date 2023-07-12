import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SubCategoryAddedEventHandler } from '@src/application/event-handlers';

const eventHandlers: Provider[] = [SubCategoryAddedEventHandler];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  providers: [...eventHandlers],
})
export class EventHandlersModule {}
