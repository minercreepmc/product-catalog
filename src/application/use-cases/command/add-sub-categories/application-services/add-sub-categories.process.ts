import { ProcessBase } from '@base/use-cases';
import { AddSubCategoriesCommand } from '@commands';
import { SubCategoriesAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@use-cases/shared/application-services/process';

export type AddSubCategoriesProcessSuccess = SubCategoriesAddedDomainEvent;
export type AddSubCategoriesProcessFailure = Array<
  | CategoryDomainExceptions.SubIdDoesNotExist
  | CategoryDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.OverlapWithSubId
>;

@Injectable()
export class AddSubCategoriesProcess extends ProcessBase<
  AddSubCategoriesProcessSuccess,
  AddSubCategoriesProcessFailure
> {
  execute(command: AddSubCategoriesCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: AddSubCategoriesCommand,
  ): Promise<void> {
    const { categoryId, subIds: subCategoryIds } = command;

    const businessRules = [
      this.categoryEnforcer.categordIdMustExist(categoryId),
      this.categoryEnforcer.subCategoriesIdMustExist(subCategoryIds),
      this.categoryEnforcer.notOverlapWithSub(categoryId, subCategoryIds),
    ];

    await Promise.all(businessRules);
  }
  protected executeMainTask(
    command: AddSubCategoriesCommand,
  ): Promise<SubCategoriesAddedDomainEvent> {
    const { categoryId, subIds } = command;
    return this.categoryManagementService.addSubCategories({
      categoryId,
      subIds,
    });
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryEnforcer: CategoryBusinessEnforcer<AddSubCategoriesProcessFailure>,
  ) {
    super({ businessEnforcer: categoryEnforcer });

    this.categoryEnforcer = categoryEnforcer;
  }
}
