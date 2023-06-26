import { BusinessRulesEnforcer } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  CategoryVerificationDomainService,
  ProductManagementDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';

export type CategoryProcessFailure = Array<
  | CategoryDomainExceptions.ParentIdDoesNotExist
  | CategoryDomainExceptions.AlreadyExist
  | CategoryDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.OverlapWithParentId
  | CategoryDomainExceptions.SubCategoryIdDoesNotExist
  | CategoryDomainExceptions.OverlapWithSubCategoryId
  | CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap
  | ProductDomainExceptions.DoesNotExist
>;

@Injectable()
export class CategoryBusinessEnforcer<
  Failures extends CategoryProcessFailure,
> extends BusinessRulesEnforcer<Failures> {
  constructor(
    private readonly categoryVerificationService: CategoryVerificationDomainService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }

  async categordIdMustExist(categoryId: CategoryIdValueObject) {
    const exist = await this.categoryVerificationService.doesCategoryIdExist(
      categoryId,
    );

    if (!exist) {
      this.exceptions.push(new CategoryDomainExceptions.DoesNotExist());
    }
  }

  async categoryNameMustNotExist(name: CategoryNameValueObject) {
    const exist = await this.categoryVerificationService.doesCategoryNameExist(
      name,
    );
    if (exist) {
      this.exceptions.push(new CategoryDomainExceptions.AlreadyExist());
    }
  }

  async parentCategoriesIdMustExist(parentIds: CategoryIdValueObject[]) {
    const exist = await this.categoryVerificationService.doesCategoryIdsExist(
      parentIds,
    );

    if (!exist) {
      this.exceptions.push(new CategoryDomainExceptions.ParentIdDoesNotExist());
    }
  }

  async parentCategoryIdMustExistIfProvided(
    parentIds: CategoryIdValueObject[],
  ) {
    if (!parentIds || parentIds.length === 0) {
      return;
    }
    const exist = await this.categoryVerificationService.doesCategoryIdsExist(
      parentIds,
    );

    if (!exist) {
      this.exceptions.push(new CategoryDomainExceptions.ParentIdDoesNotExist());
    }
  }

  async distinctParentCategories(
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

  async subCategoriesIdMustExist(subCategoryIds: SubCategoryIdValueObject[]) {
    const exist = await this.categoryVerificationService.doesCategoryIdsExist(
      subCategoryIds,
    );

    if (!exist) {
      this.exceptions.push(
        new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
      );
    }
  }

  async subCategoryIdMustExistIfProvided(
    subCategoryIds: SubCategoryIdValueObject[],
  ) {
    if (!subCategoryIds || subCategoryIds.length === 0) {
      return;
    }
    const exist = await this.categoryVerificationService.doesCategoryIdsExist(
      subCategoryIds,
    );

    if (!exist) {
      this.exceptions.push(
        new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
      );
    }
  }

  async productIdsMustExistIfProvided(productIds: CategoryIdValueObject[]) {
    if (!productIds || productIds.length === 0) {
      return;
    }
    const exist = await this.productManagementService.isProductIdsExist(
      productIds,
    );

    if (!exist) {
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }

  async distinctSubCategories(
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

  async parentIdsAndSubCategoryIdsNotOverlap(
    parentIds: ParentCategoryIdValueObject[],
    subCategoryIds: SubCategoryIdValueObject[],
  ) {
    const doesOverlap =
      this.categoryVerificationService.doesParentIdsAndSubCategoryIdsOverlap({
        parentIds,
        subCategoryIds,
      });
    if (doesOverlap) {
      this.exceptions.push(
        new CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap(),
      );
    }
  }
}
