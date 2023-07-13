import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { CategoryManagementDomainService } from '@domain-services';
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';

@EventsHandler(CategoryRemovedDomainEvent)
export class CategoryRemovedEventHandler implements IEventHandler {
  async handle(event: CategoryRemovedDomainEvent) {
    await this.removeSubCategories(event);
  }

  async removeSubCategories(event: CategoryRemovedDomainEvent) {
    if (event.subCategoryIds.length === 0) {
      return;
    }

    await this.categoryManagementService.removeCategories({
      categoryIds: event.subCategoryIds,
    });
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {}
}
