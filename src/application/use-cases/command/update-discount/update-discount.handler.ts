import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { DiscountUpdatedDomainEvent } from '@domain-events/discount';
import { DiscountManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  UpdateDiscountCommand,
  UpdateDiscountResponseDto,
} from './update-discount.dto';
import {
  UpdateDiscountFailure,
  UpdateDiscountSuccess,
} from './update-discount.result';
import { UpdateDiscountValidator } from './update-discount.validator';

@CommandHandler(UpdateDiscountCommand)
export class UpdateDiscountHandler extends CommandHandlerBase<
  UpdateDiscountCommand,
  UpdateDiscountSuccess,
  UpdateDiscountFailure
> {
  protected command: UpdateDiscountCommand;
  handle(): Promise<DiscountUpdatedDomainEvent> {
    return this.discountManagementService.updateDiscount({
      id: this.command.id,
      payload: this.command,
    });
  }
  toResponseDto(data: DiscountUpdatedDomainEvent): UpdateDiscountResponseDto {
    return new UpdateDiscountResponseDto({
      id: data.id?.value,
      name: data.name?.value,
      description: data.description?.value,
      percentage: data.percentage?.value,
      active: data.active?.value,
    });
  }

  constructor(
    validator: UpdateDiscountValidator,
    private readonly discountManagementService: DiscountManagementDomainService,
  ) {
    super(validator);
  }
}
