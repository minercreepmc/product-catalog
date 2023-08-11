import { CommandHandlerBase } from '@base/use-cases';
import { CartCreatedDomainEvent } from '@domain-events/cart';
import { CartManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import { CreateCartCommand, CreateCartResponseDto } from './create-cart.dto';
import { CreateCartFailure, CreateCartSuccess } from './create-cart.result';
import { CreateCartValidator } from './create-cart.validator';

@CommandHandler(CreateCartCommand)
export class CreateCartHandler extends CommandHandlerBase<
  CreateCartCommand,
  CreateCartSuccess,
  CreateCartFailure
> {
  constructor(
    private readonly cartManagementService: CartManagementDomainService,
    validator: CreateCartValidator,
  ) {
    super(validator);
  }
  protected command: CreateCartCommand;
  handle(): Promise<CartCreatedDomainEvent> {
    return this.cartManagementService.createCart(this.command);
  }
  toResponseDto(event: CartCreatedDomainEvent): CreateCartResponseDto {
    return new CreateCartResponseDto({
      id: event.id.value,
      userId: event.userId.value,
    });
  }
}
