import { ProcessBase } from '@base/use-cases';
import { CreateCategoryCommand } from '@commands';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@use-cases/application-services/process';

export type CreateCategoryProcessSuccess = CategoryCreatedDomainEvent;
export type CreateCategoryProcessFailure = Array<
  | CategoryDomainExceptions.AlreadyExist
  | CategoryDomainExceptions.ParentIdDoesNotExist
  | CategoryDomainExceptions.SubCategoryIdDoesNotExist
  | CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap
  | ProductDomainExceptions.DoesNotExist
>;

@Injectable()
export class CreateCategoryProcess extends ProcessBase<
  CreateCategoryProcessSuccess,
  CreateCategoryProcessFailure
> {
  execute(command: CreateCategoryCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: CreateCategoryCommand,
  ): Promise<void> {
    const { name, parentIds, productIds, subCategoryIds } = command;

    const businessRules = [
      this.categoryEnforcer.categoryNameMustNotExist(name),
      this.categoryEnforcer.parentCategoryIdMustExistIfProvided(parentIds),
      this.categoryEnforcer.subCategoryIdMustExistIfProvided(subCategoryIds),
      this.categoryEnforcer.productIdsMustExistIfProvided(productIds),
      this.categoryEnforcer.parentIdsAndSubCategoryIdsNotOverlap(
        parentIds,
        subCategoryIds,
      ),
    ];

    await Promise.all(businessRules);
  }
  protected executeMainTask(
    command: CreateCategoryCommand,
  ): Promise<CategoryCreatedDomainEvent> {
    return this.categoryManagementService.createCategory(command);
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryEnforcer: CategoryBusinessEnforcer<CreateCategoryProcessFailure>,
  ) {
    super({ businessEnforcer: categoryEnforcer });
  }
}
