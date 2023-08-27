import { CommandHandlerBase } from '@base/use-cases';
import { OrderCreatedDomainEvent } from '@domain-events/order';
import { OrderManagementDomainService } from '@domain-services/order-management.domain-service';
import { CommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand, CreateOrderResponseDto } from './create-order.dto';
import { CreateOrderFailure, CreateOrderSuccess } from './create-order.result';
import { CreateOrderValidator } from './create-order.validator';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler extends CommandHandlerBase<
  CreateOrderCommand,
  CreateOrderSuccess,
  CreateOrderFailure
> {
  constructor(
    validator: CreateOrderValidator,
    private readonly orderManagementService: OrderManagementDomainService,
  ) {
    super(validator);
  }
  protected command: CreateOrderCommand;

  handle(): Promise<OrderCreatedDomainEvent> {
    const command = this.command;

    return this.orderManagementService.createOrder({
      userId: command.userId,
      address: command.address,
      totalPrice: command.totalPrice,
    });
  }
  async toResponseDto(
    data: OrderCreatedDomainEvent,
  ): Promise<CreateOrderResponseDto> {
    return new CreateOrderResponseDto({
      id: data.id.value,
      userId: data.userId.value,
      address: data.address.value,
      totalPrice: data.totalPrice.value,
    });
  }
}