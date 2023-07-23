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
  async validate(): Promise<void> {
    const result = await this.validator.validate(this.command);

    if (result.hasExceptions()) {
      throw result.getExceptions();
    }
  }
  handle(): Promise<DiscountUpdatedDomainEvent> {
    return this.discountManagementService.updateDiscount(this.command);
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
    private readonly validator: UpdateDiscountValidator,
    private readonly discountManagementService: DiscountManagementDomainService,
  ) {
    super();
  }
}
