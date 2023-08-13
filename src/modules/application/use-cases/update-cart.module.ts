import { V1UpdateCartHttpController } from '@controllers/http/v1/update-cart.http.controller.v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateCartHandler,
  UpdateCartValidator,
} from '@use-cases/command/update-cart';

const commandHandler: Provider[] = [UpdateCartHandler, UpdateCartValidator];

const controllers = [V1UpdateCartHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...commandHandler],
})
export class UpdateCartModule {}
