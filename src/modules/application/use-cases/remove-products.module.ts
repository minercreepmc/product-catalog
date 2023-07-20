import { V1RemoveProductsHttpController } from '@controllers/http/v1/remove-products';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  RemoveProductsHandler,
  RemoveProductsValidator,
} from '@use-cases/command/remove-products';

const commandHandler: Provider[] = [
  RemoveProductsHandler,
  RemoveProductsValidator,
];

const controllers = [V1RemoveProductsHttpController];

const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class RemoveProductsModule {}
