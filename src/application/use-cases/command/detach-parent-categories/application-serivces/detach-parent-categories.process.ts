import { ProcessBase } from '@base/use-cases';
import { DetachParentCategoriesCommand } from '@commands';
import { ParentCategoriesDetachedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@use-cases/shared/application-services/process';

export type DetachParentCategoriesProcessSuccess =
  ParentCategoriesDetachedDomainEvent;
export type DetachParentCategoriesProcessFailure = Array<
  | CategoryDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.ParentIdDoesNotExist
>;

@Injectable()
export class DetachParentCategoriesProcess extends ProcessBase<
  DetachParentCategoriesProcessSuccess,
  DetachParentCategoriesProcessFailure
> {
  protected async enforceBusinessRules(
    command: DetachParentCategoriesCommand,
  ): Promise<void> {
    const { categoryId, parentIds } = command;

    const promises = [
      this.categoryEnforcer.categordIdMustExist(categoryId),
      this.categoryEnforcer.notOverlapWithParent(categoryId, parentIds),
    ];

    await Promise.all(promises);
  }
  protected executeMainTask(
    command: DetachParentCategoriesCommand,
  ): Promise<ParentCategoriesDetachedDomainEvent> {
    return this.categoryManagementService.detachParentCategories({
      categoryId: command.categoryId,
      parentIds: command.parentIds,
    });
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryEnforcer: CategoryBusinessEnforcer<DetachParentCategoriesProcessFailure>,
  ) {
    super({
      businessEnforcer: categoryEnforcer,
    });
  }
}
