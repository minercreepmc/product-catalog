import { ProcessBase } from '@base/use-cases';
import { AddSubCategoriesCommand } from '@commands';
import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@use-cases/shared/application-services/process';

export type AddSubCategoriesProcessSuccess = SubCategoryAddedDomainEvent;
export type AddSubCategoriesProcessFailure = Array<
  | CategoryDomainExceptions.SubCategoryIdDoesNotExist
  | CategoryDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.OverlapWithSubCategoryId
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
    const { categoryId, subCategoryIds } = command;

    const businessRules = [
      this.categoryEnforcer.categordIdMustExist(categoryId),
      this.categoryEnforcer.subCategoriesIdMustExist(subCategoryIds),
      this.categoryEnforcer.distinctSubCategories(categoryId, subCategoryIds),
    ];

    await Promise.all(businessRules);
  }
  protected executeMainTask(
    command: any,
  ): Promise<SubCategoryAddedDomainEvent> {
    return this.categoryManagementService.addSubCategories(command);
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryEnforcer: CategoryBusinessEnforcer<AddSubCategoriesProcessFailure>,
  ) {
    super({ businessEnforcer: categoryEnforcer });

    this.categoryEnforcer = categoryEnforcer;
  }
}
