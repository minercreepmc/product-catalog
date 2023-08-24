import { V1UpdateOrderHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  UpdateOrderHandler,
  UpdateOrderValidator,
} from '@use-cases/command/update-order';

@Module({
  imports: [DomainServicesModule, CqrsModule],
  controllers: [V1UpdateOrderHttpController],
  providers: [UpdateOrderHandler, UpdateOrderValidator],
})
export class UpdateOrderModule {}
