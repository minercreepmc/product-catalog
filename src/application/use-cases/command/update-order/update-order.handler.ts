import { CommandHandlerBase } from '@base/use-cases';
import { OrderUpdatedDomainEvent } from '@domain-events/order';
import { OrderManagementDomainService } from '@domain-services/order-management.domain-service';
import { CommandHandler } from '@nestjs/cqrs';
import { UpdateOrderCommand, UpdateOrderResponseDto } from './update-order.dto';
import { UpdateOrderFailure, UpdateOrderSuccess } from './update-order.result';
import { UpdateOrderValidator } from './update-order.validator';

@CommandHandler(UpdateOrderCommand)
export class UpdateOrderHandler extends CommandHandlerBase<
  UpdateOrderCommand,
  UpdateOrderSuccess,
  UpdateOrderFailure
> {
  constructor(
    validator: UpdateOrderValidator,
    private readonly orderManagementService: OrderManagementDomainService,
  ) {
    super(validator);
  }
  protected command: UpdateOrderCommand;

  handle(): Promise<OrderUpdatedDomainEvent> {
    const command = this.command;

    return this.orderManagementService.updateOrder(command.id, {
      address: command.address,
      status: command.status,
    });
  }
  async toResponseDto(
    data: OrderUpdatedDomainEvent,
  ): Promise<UpdateOrderResponseDto> {
    return new UpdateOrderResponseDto({
      id: data.id.value,
      address: data.address?.value,
      status: data.status?.value,
    });
  }
}
