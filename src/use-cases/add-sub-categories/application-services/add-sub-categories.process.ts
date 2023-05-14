import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import { CategoryIdValueObject } from '@value-objects/category';
import { AddSubCategoriesDomainOptions } from '../dtos';

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
  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryVerificationService: CategoryVerificationDomainService,
  ) {
    super();
  }

  async execute(domainOptions: AddSubCategoriesDomainOptions) {
    const { categoryId, subCategoryIds } = domainOptions;
    this.init();

    const conditions = [
      this.checkCategoryIdMustExist(categoryId),
      this.checkSubCategoriesIdMustExist(subCategoryIds),
      this.checkDistinctSubCategories(categoryId, subCategoryIds),
    ];

    await Promise.all(conditions);

    if (this.exceptions.length === 0) {
      await this.addSubCategories(domainOptions);
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

  private async checkSubCategoriesIdMustExist(
    subCategoryIds: CategoryIdValueObject[],
  ) {
    const exist = await this.categoryVerificationService.doesCategoryIdsExist(
      subCategoryIds,
    );

    if (!exist) {
      this.exceptions.push(
        new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
      );
    }
  }

  private async checkDistinctSubCategories(
    categoryId: CategoryIdValueObject,
    subCategoryIds: CategoryIdValueObject[],
  ) {
    const doesOverlap =
      this.categoryVerificationService.doesSubCategoryIdsOverlap({
        categoryId,
        subCategoryIds,
      });

    if (doesOverlap) {
      this.exceptions.push(
        new CategoryDomainExceptions.OverlapWithSubCategoryId(),
      );
    }
  }

  private async addSubCategories(options: AddSubCategoriesDomainOptions) {
    const subCategoriesAdded =
      await this.categoryManagementService.addSubCategories(options);

    this.value = subCategoriesAdded;
  }
}
