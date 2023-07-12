import { V1GetSubCategoriesHttpController } from '@controllers/http/v1/get-sub-categories';
import { DatabaseModule } from '@modules/infrastructures/database';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetSubCategoriesHandler } from '@use-cases/query/category/get-sub-categories';

const queryHandler: Provider[] = [GetSubCategoriesHandler];

const sharedModules = [DatabaseModule, CqrsModule];

const controllers = [V1GetSubCategoriesHttpController];

@Module({
  imports: [...sharedModules],
  providers: [...queryHandler],
  controllers: [...controllers],
})
export class GetSubCategoriesModule {}
