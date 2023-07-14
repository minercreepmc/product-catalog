import { ProcessBase } from '@base/use-cases';
import { DetachSubCategoriesCommand } from '@commands';
import { SubCategoriesDetachedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@use-cases/shared/application-services/process';

export type DetachSubCategoriesProcessSuccess =
  SubCategoriesDetachedDomainEvent;
export type DetachSubCategoriesProcessFailure = Array<
  | CategoryDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.SubCategoryIdDoesNotExist
>;

@Injectable()
export class DetachSubCategoriesProcess extends ProcessBase<
  DetachSubCategoriesProcessSuccess,
  DetachSubCategoriesProcessFailure
> {
  protected async enforceBusinessRules(
    command: DetachSubCategoriesCommand,
  ): Promise<void> {
    const { categoryId, subCategoryIds } = command;

    const promises = [
      this.categoryEnforcer.categordIdMustExist(categoryId),
      this.categoryEnforcer.subCategoriesIdMustExist(subCategoryIds),
    ];

    await Promise.all(promises);
  }
  protected executeMainTask(
    command: DetachSubCategoriesCommand,
  ): Promise<SubCategoriesDetachedDomainEvent> {
    return this.categorymanagement.detachSubCategories({
      categoryId: command.categoryId,
      subCategoryIds: command.subCategoryIds,
    });
  }

  constructor(
    private readonly categorymanagement: CategoryManagementDomainService,
    private readonly categoryEnforcer: CategoryBusinessEnforcer<DetachSubCategoriesProcessFailure>,
  ) {
    super({
      businessEnforcer: categoryEnforcer,
    });
  }
}
