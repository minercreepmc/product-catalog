import { ProcessBase } from '@base/use-cases';
import { AddParentCategoriesCommand } from '@commands';
import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@application-services/process';

export type AddParentCategoriesProcessSuccess = ParentCategoryAddedDomainEvent;
export type AddParentCategoriesProcessFailure = Array<
  | CategoryDomainExceptions.ParentIdDoesNotExist
  | CategoryDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.OverlapWithParentId
>;

@Injectable()
export class AddParentCategoriesProcess extends ProcessBase<
  AddParentCategoriesProcessSuccess,
  AddParentCategoriesProcessFailure
> {
  execute(command: AddParentCategoriesCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: AddParentCategoriesCommand,
  ): Promise<void> {
    const { parentIds, categoryId } = command;
    const businessRules = [
      this.categoryEnforcer.parentCategoriesIdMustExist(parentIds),
      this.categoryEnforcer.categordIdMustExist(categoryId),
      this.categoryEnforcer.distinctParentCategories(categoryId, parentIds),
    ];

    await Promise.all(businessRules);
  }
  protected executeMainTask(
    command: AddParentCategoriesCommand,
  ): Promise<ParentCategoryAddedDomainEvent> {
    return this.categoryManagementService.addParentCategories(command);
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryEnforcer: CategoryBusinessEnforcer<AddParentCategoriesProcessFailure>,
  ) {
    super({
      businessEnforcer: categoryEnforcer,
    });
  }
}
