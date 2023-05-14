import { CategoryDomainExceptions } from '@domain-exceptions/category/category.domain-exception';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { TranslateOptions, ValidatorBase } from '@use-cases/common';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export interface CategoryUseCaseCommand {
  name?: string;
  description?: string;
  parentIds?: string[];
  subCategoryIds?: string[];
  productIds?: string[];
}

export abstract class CategoryValidator extends ValidatorBase {
  abstract validate(command: CategoryUseCaseCommand): ValidationResponse;
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
