import { V1RemoveCategoriesHttpController } from '@controllers/http/v1/remove-categories';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  RemoveCategoriesHandler,
  RemoveCategoriesValidator,
} from '@use-cases/command/remove-categories';

const commandHandler: Provider[] = [
  RemoveCategoriesHandler,
  RemoveCategoriesValidator,
];

const controllers = [V1RemoveCategoriesHttpController];

const sharedModules = [DomainServicesModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class RemoveCategoriesModule {}
