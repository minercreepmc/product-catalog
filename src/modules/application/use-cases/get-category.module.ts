import { V1GetCategoryHttpController } from '@controllers/http/v1/get-category';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCategoryHandler } from '@use-cases/query/category/get-category';

const queryHandler: Provider[] = [GetCategoryHandler];

const controllers = [V1GetCategoryHttpController];

const sharedModules = [CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...queryHandler],
})
export class GetCategoryModule {}
