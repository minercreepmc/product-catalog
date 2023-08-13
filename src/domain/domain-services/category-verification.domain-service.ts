import { CategoryAggregate } from '@aggregates/category';
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

@Injectable()
export class CategoryVerificationDomainService {
  constructor(
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
  ) {}
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
  async findCategoryOrThrow(id: CategoryIdValueObject) {
    const exist = await this.categoryRepository.findOneById(id);
    if (!exist) {
      throw new CategoryDomainExceptions.DoesNotExist();
    }
    return exist;
  }

  async findCategoriesOrThrow(ids: CategoryIdValueObject[]) {
    const categories: CategoryAggregate[] = [];

    for (const id of ids) {
      const category = await this.categoryRepository.findOneById(id);
      if (!category) throw new CategoryDomainExceptions.DoesNotExist();
      categories.push(category);
    }
    return categories;
  }

  async findCategoryOrThrowIfExist(name: CategoryNameValueObject) {
    const exist = await this.categoryRepository.findOneByName(name);
    if (exist) {
      throw new CategoryDomainExceptions.AlreadyExist();
    }
  }
}
