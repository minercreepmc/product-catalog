import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import {
  AddParentCategoriesServiceOptions,
  AddSubCategoriesServiceOptions,
  CreateCategoryOptions,
  RemoveCategoriesServiceOptions,
  RemoveCategoryServiceOptions,
  RemoveParentCategoriesServiceOptions,
  RemoveSubCategoriesServiceOptions,
} from './category-management.domain-service';

export interface DoesParentIdsAndSubIdsOverlapServiceOptions {
  parentIds: ParentCategoryIdValueObject[];
  subIds: SubCategoryIdValueObject[];
}

export interface DoesSubCategoryIdsOverlapOptions {
  categoryId: CategoryIdValueObject;
  subIds: SubCategoryIdValueObject[];
}

export interface DoesParentIdsOverlapOptions {
  categoryId: CategoryIdValueObject;
  parentIds: ParentCategoryIdValueObject[];
}

@Injectable()
export class CategoryVerificationDomainService {
  constructor(
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async verifyCategoryRemovalOptions(options: RemoveCategoryServiceOptions) {
    const { categoryId } = options;

    await Promise.all([
      this.checkCategoryIdMustExist({
        id: categoryId,
      }),
    ]);
  }

  async verifyCategoriesRemovalOptions(
    options: RemoveCategoriesServiceOptions,
  ) {
    const { categoryIds } = options;

    const promises = categoryIds.map((id: CategoryIdValueObject) => {
      this.checkCategoryIdMustExist({ id });
    });

    await Promise.all(promises);
  }

  async verifyCategoryCreationOptions(options: CreateCategoryOptions) {
    const { name, parentIds, productIds, subIds: subCategoryIds } = options;

    await Promise.all([
      this.checkCategoryMustNotExist({ name }),
      this.checkParentIdsMustExist(parentIds),
      this.checkProductIdsMustExist(productIds),
      this.checkSubCategoryIdsMustExist(subCategoryIds),
      this.checkDistinctParentAndSubCategoryIds({
        parentIds,
        subIds: subCategoryIds,
      }),
    ]);
  }

  async verifyAddSubCategoriesOptions(options: AddSubCategoriesServiceOptions) {
    const { subIds: subCategoryIds, categoryId } = options;

    await Promise.all([
      this.checkSubCategoryIdsMustExist(subCategoryIds),
      this.checkDistinctSubCategoryIds({
        categoryId,
        subIds: subCategoryIds,
      }),
    ]);
  }

  async verifyAddParentCategoriesOptions(
    options: AddParentCategoriesServiceOptions,
  ) {
    const { parentIds, categoryId } = options;

    await Promise.all([
      this.checkCategoryIdMustExist({
        id: categoryId,
      }),
      this.checkDistinctParentIds({
        categoryId,
        parentIds,
      }),
    ]);
  }

  async verifyDetachSubCategoriesOptions(
    options: RemoveSubCategoriesServiceOptions,
  ) {
    const { subIds: subCategoryIds, categoryId } = options;

    await Promise.all([
      this.checkCategoryIdMustExist({
        id: categoryId,
      }),
      this.checkDistinctSubCategoryIds({
        categoryId,
        subIds: subCategoryIds,
      }),
    ]);
  }

  async verifyDetachParentCategoriesOptiosn(
    options: RemoveParentCategoriesServiceOptions,
  ) {
    const { parentIds, categoryId } = options;

    await Promise.all([
      this.checkCategoryIdMustExist({
        id: categoryId,
      }),
      this.checkDistinctParentIds({
        categoryId,
        parentIds,
      }),
    ]);
  }

  // Utility Methods
  doesParentIdsAndSubIdsOverlap(
    options: DoesParentIdsAndSubIdsOverlapServiceOptions,
  ): boolean {
    const { parentIds, subIds: subCategoryIds } = options;

    if (
      parentIds &&
      subCategoryIds &&
      parentIds.length > 0 &&
      subCategoryIds.length > 0
    ) {
      const allIds = [...parentIds, ...subCategoryIds].map((id) => id.unpack());
      const uniqueIds = new Set(allIds);

      if (allIds.length !== uniqueIds.size) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  doesSubCategoryIdsOverlap(options: DoesSubCategoryIdsOverlapOptions) {
    const { categoryId, subIds: subCategoryIds } = options;
    if (subCategoryIds && subCategoryIds.length > 0) {
      const subCategoryIdsArray = subCategoryIds.map((id) => id.unpack());

      if (subCategoryIdsArray.includes(categoryId.unpack())) {
        return true;
      }
    }
    return false;
  }

  doesParentIdsOverlap(options: DoesParentIdsOverlapOptions) {
    const { categoryId, parentIds } = options;
    if (parentIds && parentIds.length > 0) {
      const parentIdsArray = parentIds.map((id) => id.unpack());

      if (parentIdsArray.includes(categoryId.unpack())) {
        return true;
      }
    }
    return false;
  }

  async doesCategoryIdsExist(ids: CategoryIdValueObject[]) {
    if (!ids || ids.length === 0) {
      return true;
    }

    const checks = await Promise.all(
      ids.map((id) => this.categoryRepository.findOneById(id)),
    );

    return checks.every((exist) => exist);
  }

  async doesCategoryIdExist(id: CategoryIdValueObject): Promise<boolean> {
    const exist = await this.categoryRepository.findOneById(id);
    return Boolean(exist);
  }

  async doesCategoryNameExist(name: CategoryNameValueObject): Promise<boolean> {
    const exist = await this.categoryRepository.findOneByName(name);
    return Boolean(exist);
  }

  // Check Methods

  private async checkCategoryIdMustExist({ id }) {
    const exist = await this.categoryRepository.findOneById(id);
    if (!exist) {
      throw new CategoryDomainExceptions.DoesNotExist();
    }
  }

  private async checkCategoryMustNotExist({
    name,
  }: {
    name: CategoryNameValueObject;
  }) {
    const exist = await this.categoryRepository.findOneByName(name);
    if (exist) {
      throw new CategoryDomainExceptions.AlreadyExist();
    }
  }

  private async checkParentIdsMustExist(parentIds: CategoryIdValueObject[]) {
    const exist = await this.doesCategoryIdsExist(parentIds);
    if (!exist) {
      throw new CategoryDomainExceptions.ParentIdDoesNotExist();
    }
  }

  private async checkSubCategoryIdsMustExist(
    subCategoryIds: CategoryIdValueObject[],
  ) {
    const exist = await this.doesCategoryIdsExist(subCategoryIds);
    if (!exist) {
      throw new CategoryDomainExceptions.SubIdDoesNotExist();
    }
  }

  private async checkProductIdsMustExist(productIds: ProductIdValueObject[]) {
    if (productIds && productIds.length > 0) {
      await Promise.all(
        productIds.map(async (id) => {
          const exist = await this.productRepository.findOneById(id);
          if (!exist) {
            throw new ProductDomainExceptions.DoesNotExist();
          }
        }),
      );
    }
  }

  private async checkDistinctParentAndSubCategoryIds(
    options: DoesParentIdsAndSubIdsOverlapServiceOptions,
  ) {
    const doesOverlap = this.doesParentIdsAndSubIdsOverlap(options);
    if (doesOverlap) {
      throw new CategoryDomainExceptions.ParentIdAndSubIdOverlap();
    }
  }

  private async checkDistinctSubCategoryIds(
    options: DoesSubCategoryIdsOverlapOptions,
  ) {
    const doesOverlap = this.doesSubCategoryIdsOverlap(options);
    if (doesOverlap) {
      throw new CategoryDomainExceptions.OverlapWithSubId();
    }
  }

  private async checkDistinctParentIds(
    options: AddParentCategoriesServiceOptions,
  ) {
    const doesOverlap = this.doesParentIdsOverlap(options);
    if (doesOverlap) {
      throw new CategoryDomainExceptions.OverlapWithParentId();
    }
  }
}
