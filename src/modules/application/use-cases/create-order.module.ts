import { V1CreateOrderHttpController } from '@controllers/http/v1';
import { DomainServicesModule } from '@modules/domains';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  CreateOrderHandler,
  CreateOrderValidator,
} from '@use-cases/command/create-order';

@Module({
  imports: [DomainServicesModule, CqrsModule],
  controllers: [V1CreateOrderHttpController],
  providers: [CreateOrderHandler, CreateOrderValidator],
})
export class CreateOrderModule {}
