import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import {
  CreateCategoryOptions,
  RemoveCategoriesServiceOptions,
  RemoveCategoryServiceOptions,
} from './category-management.domain-service';

@Injectable()
export class CategoryVerificationDomainService {
  constructor(
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
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
    const { name } = options;

    await Promise.all([this.checkCategoryMustNotExist({ name })]);
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
}
