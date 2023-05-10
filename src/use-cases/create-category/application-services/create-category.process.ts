import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { CategoryRepositoryPort } from '@domain-interfaces';
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
  constructor(private readonly categoryRepository: CategoryRepositoryPort) {
    super();
  }

  async execute(domainOptions: CreateCategoryDomainOptions) {
    const { name } = domainOptions;
    this.init();
    await this.validateCategoryMustNotExist(name);
    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.clearValue();
  }

  private async validateCategoryMustNotExist(name: CategoryNameValueObject) {
    const exist = await this.categoryRepository.findOneByName(name);
    if (exist) {
      this.exceptions.push(new CategoryDomainExceptions.AlreadyExist());
    }
  }
}
