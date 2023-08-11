import { V1CreateCartHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateCartHandler,
  CreateCartValidator,
} from '@use-cases/command/create-cart';

const commandHandler: Provider[] = [CreateCartHandler, CreateCartValidator];

const controllers = [V1CreateCartHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers,
  providers: [...commandHandler],
})
export class CreateCartModule {}
