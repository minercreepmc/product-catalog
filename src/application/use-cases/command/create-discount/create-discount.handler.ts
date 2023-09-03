import { CommandHandler } from '@nestjs/cqrs';
import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import {
  CreateDiscountCommand,
  CreateDiscountResponseDto,
} from './create-discount.dto';
import {
  CreateDiscountFailure,
  CreateDiscountSuccess,
  CreateDiscountValidator,
} from './create-discount.validator';
import { DiscountCreatedDomainEvent } from '@domain-events/discount';
import { DiscountManagementDomainService } from '@domain-services';

@CommandHandler(CreateDiscountCommand)
export class CreateDiscountHandler extends CommandHandlerBase<
  CreateDiscountCommand,
  CreateDiscountSuccess,
  CreateDiscountFailure
> {
  protected command: CreateDiscountCommand;
  handle(): Promise<DiscountCreatedDomainEvent> {
    return this.discountManagementService.createDiscount(this.command);
  }
  async toResponseDto(
    data: DiscountCreatedDomainEvent,
  ): Promise<CreateDiscountResponseDto> {
    return new CreateDiscountResponseDto({
      id: data.id.value,
      name: data.name?.value,
      description: data.description?.value,
      percentage: data.percentage?.value,
      active: data.active.value,
    });
  }

  constructor(
    validator: CreateDiscountValidator,
    private readonly discountManagementService: DiscountManagementDomainService,
  ) {
    super(validator);
  }
}
