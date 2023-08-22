import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { CategoryManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from './remove-categories.dto';
import {
  RemoveCategoriesSuccess,
  RemoveCategoriesValidator,
  RemoveCategoriesFailure,
} from './remove-categories.validator';

@CommandHandler(RemoveCategoriesCommand)
export class RemoveCategoriesHandler extends CommandHandlerBase<
  RemoveCategoriesCommand,
  RemoveCategoriesSuccess,
  RemoveCategoriesFailure
> {
  constructor(
    validator: RemoveCategoriesValidator,
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {
    super(validator);
  }

  handle(): Promise<CategoryRemovedDomainEvent[]> {
    return this.categoryManagementService.removeCategories({
      categoryIds: this.command.ids,
    });
  }

  async toResponseDto(
    data: CategoryRemovedDomainEvent[],
  ): Promise<RemoveCategoriesResponseDto> {
    return new RemoveCategoriesResponseDto({
      ids: data.map((event) => event.id?.value),
    });
  }

  protected command: RemoveCategoriesCommand;
}
