import {
  V1GetCategoriesHttpController,
  V1GetCategoryHttpController,
} from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCategoriesHandler } from '@use-cases/query/category/get-categories';
import { GetCategoryHandler } from '@use-cases/query/category/get-category';

const queryHandlers: Provider[] = [GetCategoriesHandler, GetCategoryHandler];
const sharedModules = [CqrsModule];
const controllers = [
  V1GetCategoriesHttpController,
  V1GetCategoryHttpController,
];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandlers],
  controllers: [...controllers],
  exports: [],
})
export class CategoryQueryModule {}
