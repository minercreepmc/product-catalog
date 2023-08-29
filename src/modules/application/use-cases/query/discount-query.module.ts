import {
  V1GetDiscountHttpController,
  V1GetDiscountsHttpController,
} from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetDiscountHandler,
  GetDiscountsHandler,
} from '@use-cases/query/discount';

const queryHandlers: Provider[] = [GetDiscountsHandler, GetDiscountHandler];
const sharedModules = [CqrsModule];
const controllers = [V1GetDiscountsHttpController, V1GetDiscountHttpController];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
  exports: [],
})
export class DiscountQueryModule {}
