import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { CreateCategoryDomainOptions } from '../dtos';

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
  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
    private readonly categoryVerificationService: CategoryVerificationDomainService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }

  async execute(domainOptions: CreateCategoryDomainOptions) {
    const { name, parentIds, subCategoryIds, productIds } = domainOptions;
    this.init();

    const conditions = [
      this.checkCategoryMustNotExist(name),
      this.checkParentIdsExistance(parentIds),
      this.checkSubCategoriesIdExistance(subCategoryIds),
      this.checkProductIdsExistance(productIds),
      this.checkParentIdsAndSubCategoryIdsOverlap(parentIds, subCategoryIds),
    ];
    await Promise.all(conditions);

    if (!this.exceptions.length) {
      await this.createCategory(domainOptions);
    }

    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.clearValue();
  }

  private async checkCategoryMustNotExist(name: CategoryNameValueObject) {
    const exist = await this.categoryVerificationService.doesCategoryNameExist(
      name,
    );
    if (exist) {
      this.exceptions.push(new CategoryDomainExceptions.AlreadyExist());
    }
  }

  private async checkParentIdsExistance(parentIds: CategoryIdValueObject[]) {
    if (!parentIds || parentIds.length === 0) {
      return;
    }
    try {
      const exist = await this.categoryVerificationService.doesCategoryIdsExist(
        parentIds,
      );

      if (!exist) {
        this.exceptions.push(
          new CategoryDomainExceptions.ParentIdDoesNotExist(),
        );
      }
    } catch (err) {
      this.handleValidationError(err);
    }
  }

  private async checkSubCategoriesIdExistance(
    subCategoryIds: CategoryIdValueObject[],
  ) {
    if (!subCategoryIds || subCategoryIds.length === 0) {
      return;
    }
    try {
      const exist = await this.categoryVerificationService.doesCategoryIdsExist(
        subCategoryIds,
      );

      if (!exist) {
        this.exceptions.push(
          new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
        );
      }
    } catch (err) {
      this.handleValidationError(err);
    }
  }

  private async checkProductIdsExistance(productIds: CategoryIdValueObject[]) {
    if (!productIds || productIds.length === 0) {
      return;
    }
    try {
      const exist = await this.productManagementService.isProductIdsExist(
        productIds,
      );

      if (!exist) {
        this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
      }
    } catch (err) {
      this.handleValidationError(err);
    }
  }

  private async checkParentIdsAndSubCategoryIdsOverlap(
    parentIds: ParentCategoryIdValueObject[],
    subCategoryIds: SubCategoryIdValueObject[],
  ) {
    const doesOverlap =
      this.categoryVerificationService.doesParentIdsAndCategoryIdsOverlap({
        parentIds,
        subCategoryIds,
      });
    if (doesOverlap) {
      this.exceptions.push(
        new CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap(),
      );
    }
  }

  private async createCategory(options: CreateCategoryDomainOptions) {
    try {
      const created = await this.categoryManagementService.createCategory(
        options,
      );
      this.value = created;
    } catch (err) {
      this.handleValidationError(err);
    }
  }

  private handleValidationError(error: any) {
    console.error('Validation error:', error);
    this.exceptions.push(error);
  }
}
