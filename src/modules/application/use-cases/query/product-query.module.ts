import {
    V1GetBestSellingHttpController,
  V1GetProductHttpController,
  V1GetProductsHttpController,
} from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
    GetBestSellingHandler,
  GetProductQueryHandler,
  GetProductsQueryHandler,
} from '@use-cases/query/product';

const queryHandlers: Provider[] = [
  GetProductsQueryHandler,
  GetProductQueryHandler,
  GetBestSellingHandler
];

const controllers = [V1GetProductsHttpController, V1GetProductHttpController, V1GetBestSellingHttpController];

const sharedModules = [CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...queryHandlers],
})
export class ProductQueryModule {}
