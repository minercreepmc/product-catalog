import {
  V1GetOrderHttpController,
  V1GetOrdersHttpController,
  V1GetOrdersByUserHttpController,
} from '@controllers/http/v1';
import { Provider, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetOrderHandler,
  GetOrdersHandler,
  GetOrdersByUserHandler,
} from '@use-cases/query/order';

const queryHandlers: Provider[] = [
  GetOrderHandler,
  GetOrdersHandler,
  GetOrdersByUserHandler,
];
const sharedModules = [CqrsModule];
const controllers = [
  V1GetOrderHttpController,
  V1GetOrdersHttpController,
  V1GetOrdersByUserHttpController,
];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
})
export class OrderQueryModule {}
