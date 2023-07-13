import { ProcessBase } from '@base/use-cases';
import { RemoveCategoriesCommand } from '@commands';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CategoryBusinessEnforcer } from '@use-cases/shared/application-services/process';

export type RemoveCategoriesProcessSuccess = CategoryRemovedDomainEvent[];
export type RemoveCategoriesProcessFailure =
  Array<CategoryDomainExceptions.DoesNotExist>;

@Injectable()
export class RemoveCategoriesProcess extends ProcessBase<
  RemoveCategoriesProcessSuccess,
  RemoveCategoriesProcessFailure
> {
  protected async enforceBusinessRules(
    command: RemoveCategoriesCommand,
  ): Promise<void> {
    const { ids } = command;

    const promises = ids.map((id) =>
      this.categoryBusinessEnforcer.categordIdMustExist(id),
    );

    await Promise.all(promises);
  }
  protected async executeMainTask(
    command: RemoveCategoriesCommand,
  ): Promise<RemoveCategoriesProcessSuccess> {
    const { ids } = command;
    try {
      const events = await this.categoryManagementService.removeCategories({
        categoryIds: ids
      })
      return events;
    } catch (err) {
      this.exceptions.push(err);
    }
  }

  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryBusinessEnforcer: CategoryBusinessEnforcer<RemoveCategoriesProcessFailure>,
  ) {
    super({
      businessEnforcer: categoryBusinessEnforcer,
    });
  }
}
