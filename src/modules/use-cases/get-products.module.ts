import { V1GetProductsHttpController } from '@controllers/http/v1/get-products';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetProductsQueryHandler } from '@use-cases/query/product/get-products';

const queryHandlers: Provider[] = [GetProductsQueryHandler];

const controllers = [V1GetProductsHttpController];

const sharedModules = [DatabaseModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...queryHandlers],
})
export class GetProductsModule {}
