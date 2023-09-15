import { V1RemoveDiscountHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  RemoveDiscountHandler,
  RemoveDiscountValidator,
} from '@use-cases/command/remove-discount';

@Module({
  imports: [DomainServicesModule, CqrsModule],
  controllers: [V1RemoveDiscountHttpController],
  providers: [RemoveDiscountHandler, RemoveDiscountValidator],
})
export class RemoveDiscountModule {}
