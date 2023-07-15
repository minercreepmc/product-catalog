import { EventHandlerBase } from '@base/use-cases/event-handler';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { DetachParentCategoriesRequestDto } from '@use-cases/command/detach-parent-categories/dtos';
import { DetachSubCategoriesRequestDto } from '@use-cases/command/detach-sub-categories/dtos/detach-sub-categories.dto';
import { Mediator, NotificationHandler } from 'nestjs-mediator';

@NotificationHandler(CategoryRemovedDomainEvent)
export class CategoryRemovedEventHandler extends EventHandlerBase<CategoryRemovedDomainEvent> {
  async handle(event: CategoryRemovedDomainEvent) {
    const { categoryId, parentIds, subIds } = event;

    const detachSubDtos = parentIds.map(
      (parentId) =>
        new DetachSubCategoriesRequestDto({
          subIds: [categoryId.unpack()],
          categoryId: parentId.unpack(),
        }),
    );

    await this.detachSubCategories(detachSubDtos);

    const detachParentDtos = subIds.map(
      (subId) =>
        new DetachParentCategoriesRequestDto({
          parentIds: [categoryId.unpack()],
          categoryId: subId.unpack(),
        }),
    );

    await this.detachParentCategories(detachParentDtos);
  }

  async detachSubCategories(dtos: DetachSubCategoriesRequestDto[]) {
    const sending = dtos.map((dto) => this.mediator.send(dto));

    const results = await Promise.all(sending);

    results.forEach((result) => {
      this.handlerException(result);
    });
  }

  async detachParentCategories(dtos: DetachParentCategoriesRequestDto[]) {
    const sending = dtos.map((dto) => this.mediator.send(dto));

    const results = await Promise.all(sending);

    results.forEach((result) => {
      this.handlerException(result);
    });
  }

  constructor(mediator: Mediator) {
    super(mediator);
  }
}
