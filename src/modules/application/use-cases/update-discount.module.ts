import { V1UpdateDiscountHttpController } from '@controllers/http/v1/update-discount';
import { DomainServicesModule } from '@modules/domains';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateDiscountHandler,
  UpdateDiscountValidator,
} from '@use-cases/command/update-discount';

const handler: Provider[] = [UpdateDiscountHandler, UpdateDiscountValidator];

const controllers = [V1UpdateDiscountHttpController];

const sharedModule = [DomainServicesModule, CqrsModule];

@Module({
  imports: [...sharedModule],
  controllers: [...controllers],
  providers: [...handler],
})
export class UpdateDiscountModule {}
