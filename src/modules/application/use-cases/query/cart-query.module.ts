import { V1GetCartHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCartQueryHandler } from '@use-cases/query/cart';

export const queryHandlers: Provider[] = [GetCartQueryHandler];
const sharedModules = [CqrsModule];
const controllers = [V1GetCartHttpController];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
  exports: [],
})
export class CartQueryModule {}
