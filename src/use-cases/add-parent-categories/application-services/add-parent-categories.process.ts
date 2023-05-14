import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import { CategoryIdValueObject } from '@value-objects/category';
import { AddParentCategoriesDomainOptions } from '../dtos';

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
  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryVerificationService: CategoryVerificationDomainService,
  ) {
    super();
  }

  async execute(domainOptions: AddParentCategoriesDomainOptions) {
    const { categoryId, parentIds } = domainOptions;
    this.init();

    const conditions = [
      this.checkCategoryIdMustExist(categoryId),
      this.checkParentCategoriesIdMustExist(parentIds),
      this.checkDistinctParentCategories(categoryId, parentIds),
    ];

    await Promise.all(conditions);

    if (this.exceptions.length === 0) {
      await this.addParentCategories(domainOptions);
    }

    return this.getValidationResult();
  }

  protected init(): void {
    this.clearValue();
    this.clearExceptions();
  }

  private async checkCategoryIdMustExist(categoryId: CategoryIdValueObject) {
    const exist = await this.categoryVerificationService.doesCategoryIdExist(
      categoryId,
    );

    if (!exist) {
      this.exceptions.push(new CategoryDomainExceptions.DoesNotExist());
    }
  }

  private async checkParentCategoriesIdMustExist(
    parentIds: CategoryIdValueObject[],
  ) {
    const exist = await this.categoryVerificationService.doesCategoryIdsExist(
      parentIds,
    );

    if (!exist) {
      this.exceptions.push(new CategoryDomainExceptions.ParentIdDoesNotExist());
    }
  }

  private async checkDistinctParentCategories(
    categoryId: CategoryIdValueObject,
    parentIds: CategoryIdValueObject[],
  ) {
    const doesOverlap = this.categoryVerificationService.doesParentIdsOverlap({
      categoryId,
      parentIds,
    });

    if (doesOverlap) {
      this.exceptions.push(new CategoryDomainExceptions.OverlapWithParentId());
    }
  }

  private async addParentCategories(options: AddParentCategoriesDomainOptions) {
    const parentCategoriesAdded =
      await this.categoryManagementService.addParentCategories(options);

    this.value = parentCategoriesAdded;
  }
}
