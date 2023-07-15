import { EventHandlerBase } from '@base/use-cases/event-handler';
import { ParentCategoriesAddedDomainEvent } from '@domain-events/category';
import { QueryBus } from '@nestjs/cqrs';
import { AddSubCategoriesRequestDto } from '@use-cases/command/add-sub-categories/dtos';
import {
  GetCategoryQuery,
  GetCategoryResponseDto,
} from '@use-cases/query/category/get-category';
import { Mediator, NotificationHandler } from 'nestjs-mediator';

@NotificationHandler(ParentCategoriesAddedDomainEvent)
export class ParentCategoriesAddedEventHandler extends EventHandlerBase<ParentCategoriesAddedDomainEvent> {
  async handle(event: ParentCategoriesAddedDomainEvent): Promise<void> {
    const categoryId = event.categoryId.unpack();
    const parentIds = event.parentIds.map((id) => id.unpack());

    const allContainChildId = await this.allParentCategoriesContainChildId(
      categoryId,
      parentIds,
    );

    if (allContainChildId) {
      return;
    }

    const dtos = parentIds.map((parentId) => {
      return new AddSubCategoriesRequestDto({
        categoryId: parentId,
        subIds: [categoryId],
      });
    });

    try {
      const sending = dtos.map((dto) => this.mediator.send(dto));

      const results = await Promise.all(sending);

      results.forEach((result) => {
        this.handlerException(result);
      });
    } catch (err) {
      throw err;
    }
  }

  async allParentCategoriesContainChildId(
    childId: string,
    parentIds: string[],
  ): Promise<boolean> {
    const getChildIdsPromises = parentIds.map((parentId) => {
      const getCategory = new GetCategoryQuery({
        where: {
          id: parentId,
        },
      });

      return this.queryBus.execute<GetCategoryQuery, GetCategoryResponseDto>(
        getCategory,
      );
    });

    const categories = await Promise.all(getChildIdsPromises);
    return categories.every((category) => category.subIds.includes(childId));
  }

  constructor(mediator: Mediator, private readonly queryBus: QueryBus) {
    super(mediator);
  }
}
