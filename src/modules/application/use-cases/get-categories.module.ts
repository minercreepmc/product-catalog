import { V1GetCategoriesHttpController } from '@controllers/http/v1/get-categories';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCategoriesHandler } from '@use-cases/query/category/get-categories';

const queryHandlers: Provider[] = [GetCategoriesHandler];
const sharedModules = [CqrsModule];
const controllers = [V1GetCategoriesHttpController];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
  exports: [],
})
export class GetCategoriesModule {}
