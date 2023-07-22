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
  handle(): Promise<CategoryRemovedDomainEvent[]> {
    return this.categoryManagementService.removeCategories({
      categoryIds: this.command.ids,
    });
  }
  async validate(): Promise<void> {
    const result = await this.validator.validate(this.command);

    if (result.hasExceptions()) {
      throw result.getExceptions();
    }
  }

  toResponseDto(
    data: CategoryRemovedDomainEvent[],
  ): RemoveCategoriesResponseDto {
    return new RemoveCategoriesResponseDto({
      ids: data.map((event) => event.id.value),
    });
  }

  protected command: RemoveCategoriesCommand;
  constructor(
    private readonly validator: RemoveCategoriesValidator,
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {
    super();
  }
}
