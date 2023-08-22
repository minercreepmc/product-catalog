import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { CategoryUpdatedDomainEvent } from '@domain-events/category';
import { CategoryManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  UpdateCategoryCommand,
  UpdateCategoryResponseDto,
} from './update-category.dto';
import {
  UpdateCategoryFailure,
  UpdateCategorySuccess,
} from './update-category.result';
import { UpdateCategoryValidator } from './update-category.validator';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler extends CommandHandlerBase<
  UpdateCategoryCommand,
  UpdateCategorySuccess,
  UpdateCategoryFailure
> {
  constructor(
    validator: UpdateCategoryValidator,
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {
    super(validator);
  }

  protected command: UpdateCategoryCommand;
  handle(): Promise<CategoryUpdatedDomainEvent> {
    const { command } = this;
    const { id, productIds, name, description } = command;
    return this.categoryManagementService.updateCategory({
      id,
      payload: {
        productIds,
        name,
        description,
      },
    });
  }
  async toResponseDto(
    event: CategoryUpdatedDomainEvent,
  ): Promise<UpdateCategoryResponseDto> {
    return new UpdateCategoryResponseDto({
      id: event.id?.value,
      name: event.name?.value,
      description: event.description?.value,
      productIds: event.productIds?.map?.((id) => id?.value),
    });
  }
}
