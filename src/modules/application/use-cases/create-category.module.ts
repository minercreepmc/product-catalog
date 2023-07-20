import { V1CreateCategoryHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { DomainServicesModule } from '@modules/domains';
import {
  CreateCategoryHandler,
  CreateCategoryValidator,
} from '@use-cases/command/create-category';
import { CqrsModule } from '@nestjs/cqrs';

const commandHandler: Provider[] = [
  CreateCategoryHandler,
  CreateCategoryValidator,
];

const controllers = [V1CreateCategoryHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...commandHandler],
})
export class CreateCategoryModule {}
