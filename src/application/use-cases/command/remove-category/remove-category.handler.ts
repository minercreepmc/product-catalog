import { CommandHandlerBase } from '@base/use-cases';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { CategoryManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RemoveCategoryCommand,
  RemoveCategoryResponseDto,
} from './remove-category.dto';
import {
  RemoveCategoryFailure,
  RemoveCategorySuccess,
} from './remove-category.result';
import { RemoveCategoryValidator } from './remove-category.validator';

@CommandHandler(RemoveCategoryCommand)
export class RemoveCategoryHandler extends CommandHandlerBase<
  RemoveCategoryCommand,
  RemoveCategorySuccess,
  RemoveCategoryFailure
> {
  protected command: RemoveCategoryCommand;
  handle(): Promise<CategoryRemovedDomainEvent> {
    return this.categorymanagementService.removeCategory({
      categoryId: this.command.id,
    });
  }
  async toResponseDto(
    event: CategoryRemovedDomainEvent,
  ): Promise<RemoveCategoryResponseDto> {
    return new RemoveCategoryResponseDto({
      id: event.id.value,
    });
  }
  constructor(
    validator: RemoveCategoryValidator,
    private readonly categorymanagementService: CategoryManagementDomainService,
  ) {
    super(validator);
  }
}
