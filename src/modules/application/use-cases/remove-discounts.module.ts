import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { V1RemoveDiscountsHttpController } from '@controllers/http/v1';
import {
  RemoveDiscountsHandler,
  RemoveDiscountsValidator,
} from '@use-cases/command/remove-discounts';

const handler: Provider[] = [RemoveDiscountsHandler, RemoveDiscountsValidator];
const controllers = [V1RemoveDiscountsHttpController];
const sharedModules = [CqrsModule, DomainServicesModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...handler],
})
export class RemoveDiscountsModule {}
