import { V1GetOrderHttpController } from '@controllers/http/v1';
import { Provider, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetOrderHandler } from '@use-cases/query/order';

const queryHandlers: Provider[] = [GetOrderHandler];
const sharedModules = [CqrsModule];
const controllers = [V1GetOrderHttpController];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
})
export class OrderQueryModule {}
