import { V1GetOrderHttpController } from '@controllers/http/v1';
import { V1GetOrdersHttpController } from '@controllers/http/v1/get/get-orders.http.controller.v1';
import { Provider, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetOrderHandler, GetOrdersHandler } from '@use-cases/query/order';

const queryHandlers: Provider[] = [GetOrderHandler, GetOrdersHandler];
const sharedModules = [CqrsModule];
const controllers = [V1GetOrderHttpController, V1GetOrdersHttpController];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
})
export class OrderQueryModule {}
