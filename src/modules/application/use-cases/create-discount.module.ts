import { V1CreateDiscountHttpController } from '@controllers/http/v1/create-discount';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateDiscountHandler,
  CreateDiscountValidator,
} from '@use-cases/command/create-discount';

const handler: Provider[] = [CreateDiscountHandler, CreateDiscountValidator];
const controllers = [V1CreateDiscountHttpController];
const sharedModules = [DomainServicesModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...handler],
})
export class CreateDiscountModule {}
