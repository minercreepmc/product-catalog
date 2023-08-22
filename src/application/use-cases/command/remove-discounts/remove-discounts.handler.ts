import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { DiscountRemovedDomainEvent } from '@domain-events/discount';
import { DiscountManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RemoveDiscountsCommand,
  RemoveDiscountsResponseDto,
} from './remove-discounts.dto';
import {
  RemoveDiscountsFailure,
  RemoveDiscountsSuccess,
} from './remove-discounts.result';
import { RemoveDiscountsValidator } from './remove-discounts.validator';

@CommandHandler(RemoveDiscountsCommand)
export class RemoveDiscountsHandler extends CommandHandlerBase<
  RemoveDiscountsCommand,
  RemoveDiscountsSuccess,
  RemoveDiscountsFailure
> {
  constructor(
    private readonly discountManagementService: DiscountManagementDomainService,
    validator: RemoveDiscountsValidator,
  ) {
    super(validator);
  }
  protected command: RemoveDiscountsCommand;
  handle(): Promise<DiscountRemovedDomainEvent[]> {
    return this.discountManagementService.removeDiscounts(this.command);
  }
  async toResponseDto(
    events: DiscountRemovedDomainEvent[],
  ): Promise<RemoveDiscountsResponseDto> {
    return new RemoveDiscountsResponseDto({
      ids: events.map((event) => event.id.value),
    });
  }
}
