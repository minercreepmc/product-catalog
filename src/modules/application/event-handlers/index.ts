import { Module, Provider } from '@nestjs/common';
import {
  SubCategoriesAddedEventHandler,
  ParentCategoriesAddedEventHandler,
  CategoryRemovedEventHandler,
} from '@event-handlers';
import { MediatorModule } from 'nestjs-mediator';
import { CqrsModule } from '@nestjs/cqrs';

const eventHandlers: Provider[] = [
  SubCategoriesAddedEventHandler,
  ParentCategoriesAddedEventHandler,
  CategoryRemovedEventHandler,
];
const sharedModules = [MediatorModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  providers: [...eventHandlers],
})
export class EventHandlersModule {}
