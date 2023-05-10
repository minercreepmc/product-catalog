import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import { CategoryNameValueObject } from '@value-objects/category';
import { CreateCategoryDomainOptions } from '../dtos';

export type CreateCategoryProcessSuccess = CategoryCreatedDomainEvent;
export type CreateCategoryProcessFailure =
  Array<CategoryDomainExceptions.AlreadyExist>;

@Injectable()
export class CreateCategoryProcess extends ProcessBase<
  CreateCategoryProcessSuccess,
  CreateCategoryProcessFailure
> {
  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {
    super();
  }

  isExist: boolean;

  async execute(domainOptions: CreateCategoryDomainOptions) {
    const { name } = domainOptions;
    this.init();
    await this.validateCategoryMustNotExist(name);
    await this.createCategoryIfNotExistYet(domainOptions);
    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.clearValue();

    this.isExist = false;
  }

  private async validateCategoryMustNotExist(name: CategoryNameValueObject) {
    const exist = await this.categoryManagementService.doesCategoryNameExist(
      name,
    );
    if (exist) {
      this.isExist = true;
      this.exceptions.push(new CategoryDomainExceptions.AlreadyExist());
    }
  }

  private async createCategoryIfNotExistYet(
    domainOptions: CreateCategoryDomainOptions,
  ) {
    if (!this.isExist) {
      const created = await this.categoryManagementService.createCategory(
        domainOptions,
      );
      this.value = created;
    }
  }
}
