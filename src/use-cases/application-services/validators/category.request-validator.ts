import { TranslateOptions, RequestValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { AddParentCategoriesRequestDto } from '@use-cases/add-parent-categories/dtos';
import { AddSubCategoriesRequestDto } from '@use-cases/add-sub-categories/dtos';
import { CreateCategoryRequestDto } from '@use-cases/create-category/dtos';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { ValidationExceptionBase } from 'common-base-classes';

export type CategoryRequestDto = CreateCategoryRequestDto &
  AddParentCategoriesRequestDto &
  AddSubCategoriesRequestDto;

export class CategoryRequestValidator extends RequestValidatorBase {
  _validate(requestDto: CategoryRequestDto): void {
    const { name, description, parentIds, subCategoryIds, productIds } =
      requestDto;

    if (name !== undefined) {
      this.validateName(name);
    }

    if (description !== undefined) {
      this.validateDescription(description);
    }

    if (parentIds !== undefined) {
      this.validateParentCategoryId(parentIds);
    }

    if (subCategoryIds !== undefined) {
      this.validateSubCategoryIds(subCategoryIds);
    }

    if (productIds !== undefined) {
      this.validateProductIds(productIds);
    }
  }
  translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;
    switch (context) {
      case CategoryIdValueObject.name:
        return new CategoryDomainExceptions.IdDoesNotValid();
      case SubCategoryIdValueObject.name:
        return new CategoryDomainExceptions.SubCategoryIdsDoesNotValid();
      case ParentCategoryIdValueObject.name:
        return new CategoryDomainExceptions.ParentIdDoesNotValid();
      case CategoryNameValueObject.name:
        return new CategoryDomainExceptions.NameDoesNotValid();
      case CategoryDescriptionValueObject.name:
        return new CategoryDomainExceptions.DescriptionDoesNotValid();
      case ProductIdValueObject.name:
        return new ProductDomainExceptions.IdDoesNotValid();
      default:
        return exception;
    }
  }

  validateCategoryId(id: string): void {
    const response = CategoryIdValueObject.validate(id);
    this.handlerValidationResponse({
      response: response,
      context: CategoryIdValueObject.name,
    });
  }

  validateSubCategoryIds(subCategoryIds: string[]): void {
    subCategoryIds.forEach((subCategoryId) => {
      const response = SubCategoryIdValueObject.validate(subCategoryId);
      this.handlerValidationResponse({
        response: response,
        context: SubCategoryIdValueObject.name,
      });
    });
  }

  validateParentCategoryId(parentIds: string[]): void {
    parentIds.forEach((parentId) => {
      const response = ParentCategoryIdValueObject.validate(parentId);
      this.handlerValidationResponse({
        response: response,
        context: ParentCategoryIdValueObject.name,
      });
    });
  }

  validateName(name: string): void {
    const response = CategoryNameValueObject.validate(name);
    this.handlerValidationResponse({
      response: response,
      context: CategoryNameValueObject.name,
    });
  }

  validateDescription(description: string): void {
    const response = CategoryDescriptionValueObject.validate(description);
    this.handlerValidationResponse({
      response: response,
      context: CategoryDescriptionValueObject.name,
    });
  }

  validateProductIds(productIds: string[]): void {
    productIds.forEach((productId) => {
      const response = ProductIdValueObject.validate(productId);
      this.handlerValidationResponse({
        response: response,
        context: ProductIdValueObject.name,
      });
    });
  }
}
