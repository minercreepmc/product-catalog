import { V1RemoveCategoryHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  RemoveCategoryHandler,
  RemoveCategoryValidator,
} from '@use-cases/command/remove-category';

const commandHandler: Provider[] = [
  RemoveCategoryHandler,
  RemoveCategoryValidator,
];

const controllers = [V1RemoveCategoryHttpController];

const sharedModules = [DomainServicesModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class RemoveCategoryModule {}
