import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryManagementDomainService } from '@domain-services';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(SubCategoryAddedDomainEvent)
export class SubCategoryAddedEventHandler
  implements IEventHandler<SubCategoryAddedDomainEvent>
{
  async handle(event: SubCategoryAddedDomainEvent) {
    await this.addParentCategoryToSubCategories(event);
  }

  async addParentCategoryToSubCategories(event: SubCategoryAddedDomainEvent) {
    const categoryId = event.categoryId;
    const subCategoryIds = event.subCategoryIds;

    const promises = subCategoryIds.map((subCategoryId) => {
      this.categoryManagementService.addParentCategories({
        categoryId: subCategoryId,
        parentIds: [categoryId],
      });
    });

    await Promise.all(promises);
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {}
}
