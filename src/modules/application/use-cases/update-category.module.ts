import { V1UpdateCategoryHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateCategoryHandler,
  UpdateCategoryValidator,
} from '@use-cases/command/update-category';

const handler: Provider[] = [UpdateCategoryHandler, UpdateCategoryValidator];
const controllers = [V1UpdateCategoryHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...handler],
})
export class UpdateCategoryModule {}
