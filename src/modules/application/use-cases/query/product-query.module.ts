import { V1GetProductHttpController } from '@controllers/http/v1/get-product';
import { V1GetProductsHttpController } from '@controllers/http/v1/get-products';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  GetProductQueryHandler,
  GetProductsQueryHandler,
} from '@use-cases/query/product';

const queryHandlers: Provider[] = [
  GetProductsQueryHandler,
  GetProductQueryHandler,
];

const controllers = [V1GetProductsHttpController, V1GetProductHttpController];

const sharedModules = [CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...queryHandlers],
})
export class ProductQueryModule {}
