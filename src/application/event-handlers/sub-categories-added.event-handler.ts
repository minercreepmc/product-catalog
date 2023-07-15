import { EventHandlerBase } from '@base/use-cases/event-handler';
import { SubCategoriesAddedDomainEvent } from '@domain-events/category';
import { QueryBus } from '@nestjs/cqrs';
import { AddParentCategoriesRequestDto } from '@use-cases/command/add-parent-categories/dtos';
import {
  GetCategoryQuery,
  GetCategoryResponseDto,
} from '@use-cases/query/category/get-category';
import { Mediator, NotificationHandler } from 'nestjs-mediator';

@NotificationHandler(SubCategoriesAddedDomainEvent)
export class SubCategoriesAddedEventHandler extends EventHandlerBase<SubCategoriesAddedDomainEvent> {
  async handle(event: SubCategoriesAddedDomainEvent): Promise<void> {
    const categoryId = event.categoryId.unpack();
    const subCategoryIds = event.subIds.map((id) => id.unpack());

    const allContainParentId = await this.allSubcategoriesContainParentId(
      categoryId,
      subCategoryIds,
    );

    if (allContainParentId) {
      return;
    }

    try {
      const dtos = subCategoryIds.map((subCategoryId) => {
        return new AddParentCategoriesRequestDto({
          categoryId: subCategoryId,
          parentIds: [categoryId],
        });
      });

      const sending = dtos.map((dto) => this.mediator.send(dto));

      const results = await Promise.all(sending);

      results.forEach((result) => {
        this.handlerException(result);
      });
    } catch (err) {
      throw err;
    }
  }

  async allSubcategoriesContainParentId(
    categoryId: string,
    subCategoryIds: string[],
  ): Promise<boolean> {
    const getParentIdsPromises = subCategoryIds.map((subCategoryId) => {
      const getCategory = new GetCategoryQuery({
        where: {
          id: subCategoryId,
        },
      });

      return this.queryBus.execute<GetCategoryQuery, GetCategoryResponseDto>(
        getCategory,
      );
    });

    const categories = await Promise.all(getParentIdsPromises);
    return categories.every((category) =>
      category.parentIds.includes(categoryId),
    );
  }

  constructor(mediator: Mediator, private readonly queryBus: QueryBus) {
    super(mediator);
  }
}
