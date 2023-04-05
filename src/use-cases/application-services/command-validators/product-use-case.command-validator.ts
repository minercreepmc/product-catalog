import { ProductDomainException } from '@domain-exceptions/product';
import { Injectable } from '@nestjs/common';
import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@use-cases/common';
import {
  CreateProductAttributesOptions,
  CreateProductPriceValueObjectOptions,
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export interface ProductUseCaseCommand {
  id?: string;
  name?: string;
  price?: CreateProductPriceValueObjectOptions;
  description?: string;
  image?: string;
  attributes?: CreateProductAttributesOptions;
}

@Injectable()
export class ProductCommandValidator extends CommandValidatorBase {
  validate(command: ProductUseCaseCommand): ValidationResponse {
    const { id, name, price, description, image, attributes } = command;
    this.clearExceptions();
    if (id !== undefined) {
      this.validateProductId(id);
    }

    if (name !== undefined) {
      this.validateName(name);
    }

    if (price !== undefined) {
      this.validatePrice(price);
    }

    if (description !== undefined) {
      this.validateDescription(description);
    }

    if (image !== undefined) {
      this.validateImage(image);
    }

    if (attributes !== undefined) {
      this.validateAttributes(attributes);
    }

    return this.getValidationResponse();
  }
  protected translateExceptionToUserFriendlyMessage(
    options: TranslateExceptionToUserFriendlyMessageOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;
    switch (context) {
      case ProductIdValueObject.name:
        return new ProductDomainException.IdIsNotValid();
      case ProductNameValueObject.name:
        return new ProductDomainException.NameIsNotValid();
      case ProductPriceValueObject.name:
        return new ProductDomainException.PriceIsNotValid();
      case ProductDescriptionValueObject.name:
        return new ProductDomainException.DescriptionIsNotValid();
      case ProductImageValueObject.name:
        return new ProductDomainException.ImageIsNotValid();
      default:
        return exception;
    }
  }

  protected validateProductId(id: string): void {
    const response = ProductIdValueObject.validate(id);
    this.handlerValidationResponse({
      response,
      context: ProductIdValueObject.name,
    });
  }

  protected validateName(name: string): void {
    const response = ProductNameValueObject.validate(name);

    this.handlerValidationResponse({
      response,
      context: ProductNameValueObject.name,
    });
  }

  protected validatePrice(price: CreateProductPriceValueObjectOptions): void {
    const response = ProductPriceValueObject.validate(price);

    this.handlerValidationResponse({
      response,
      context: ProductPriceValueObject.name,
    });
  }

  protected validateDescription(description: string): void {
    const response = ProductDescriptionValueObject.validate(description);

    this.handlerValidationResponse({
      response,
      context: ProductDescriptionValueObject.name,
    });
  }

  protected validateImage(image: string): void {
    const response = ProductImageValueObject.validate(image);

    this.handlerValidationResponse({
      response,
      context: ProductImageValueObject.name,
    });
  }

  protected validateAttributes(attributes: CreateProductAttributesOptions) {
    const response = ProductAttributesValueObject.validate(attributes);

    this.handlerValidationResponse({
      response,
      context: ProductAttributesValueObject.name,
    });
  }
}
