import { CommandHandlerBase } from '@base/use-cases';
import { DiscountRemovedDomainEvent } from '@domain-events/discount';
import { DiscountManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RemoveDiscountCommand,
  RemoveDiscountResponseDto,
} from './remove-discount.dto';
import {
  RemoveDiscountFailure,
  RemoveDiscountSuccess,
} from './remove-discount.result';
import { RemoveDiscountValidator } from './remove-discount.validator';

@CommandHandler(RemoveDiscountCommand)
export class RemoveDiscountHandler extends CommandHandlerBase<
  RemoveDiscountCommand,
  RemoveDiscountSuccess,
  RemoveDiscountFailure
> {
  constructor(
    private readonly discountManagementService: DiscountManagementDomainService,
    validator: RemoveDiscountValidator,
  ) {
    super(validator);
  }
  protected command: RemoveDiscountCommand;
  handle(): Promise<DiscountRemovedDomainEvent> {
    return this.discountManagementService.removeDiscount(this.command);
  }
  async toResponseDto(
    event: DiscountRemovedDomainEvent,
  ): Promise<RemoveDiscountResponseDto> {
    return new RemoveDiscountResponseDto({
      id: event.id.value,
    });
  }
}
