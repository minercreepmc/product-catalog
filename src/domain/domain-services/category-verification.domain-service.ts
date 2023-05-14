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
  AddSubCategoriesServiceOptions,
  CreateCategoryOptions,
} from './category-management.domain-service';

export interface DoesParentIdsAndCategoryIdsOverlapServiceOptions {
  parentIds: ParentCategoryIdValueObject[];
  subCategoryIds: SubCategoryIdValueObject[];
}

export interface DoesSubCategoryIdsOverlapOptions {
  categoryId: CategoryIdValueObject;
  subCategoryIds: SubCategoryIdValueObject[];
}

@Injectable()
export class CategoryVerificationDomainService {
  constructor(
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async verifyCategoryCreationOptions(options: CreateCategoryOptions) {
    const { name, parentIds, productIds, subCategoryIds } = options;

    await Promise.all([
      this.checkCategoryMustNotExist({ name }),
      this.checkParentIdsMustExist(parentIds),
      this.checkProductIdsMustExist(productIds),
      this.checkSubCategoryIdsMustExist(subCategoryIds),
      this.checkDistinctParentAndSubCategoryIds({ parentIds, subCategoryIds }),
    ]);
  }

  async verifyAddSubCategoriesOptions(options: AddSubCategoriesServiceOptions) {
    const { subCategoryIds, categoryId } = options;

    await Promise.all([
      this.checkSubCategoryIdsMustExist(subCategoryIds),
      this.checkDistinctSubCategoryIds({
        categoryId,
        subCategoryIds,
      }),
    ]);
  }

  // Utility Methods
  doesParentIdsAndCategoryIdsOverlap(
    options: DoesParentIdsAndCategoryIdsOverlapServiceOptions,
  ): boolean {
    const { parentIds, subCategoryIds } = options;

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
    const { categoryId, subCategoryIds } = options;
    if (subCategoryIds && subCategoryIds.length > 0) {
      const subCategoryIdsArray = subCategoryIds.map((id) => id.unpack());

      if (subCategoryIdsArray.includes(categoryId.unpack())) {
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
    const exist = this.doesCategoryIdsExist(parentIds);
    if (!exist) {
      throw new CategoryDomainExceptions.ParentIdDoesNotExist();
    }
  }

  private async checkSubCategoryIdsMustExist(
    subCategoryIds: CategoryIdValueObject[],
  ) {
    const exist = await this.doesCategoryIdsExist(subCategoryIds);
    if (!exist) {
      throw new CategoryDomainExceptions.SubCategoryIdDoesNotExist();
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
    options: DoesParentIdsAndCategoryIdsOverlapServiceOptions,
  ) {
    const doesOverlap = this.doesParentIdsAndCategoryIdsOverlap(options);
    if (doesOverlap) {
      throw new CategoryDomainExceptions.ParentIdAndSubCategoryIdOverlap();
    }
  }

  private async checkDistinctSubCategoryIds(
    options: DoesSubCategoryIdsOverlapOptions,
  ) {
    const doesOverlap = this.doesSubCategoryIdsOverlap(options);
    if (doesOverlap) {
      throw new CategoryDomainExceptions.OverlapWithSubCategoryId();
    }
  }
}
