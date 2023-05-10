import { ProductDomainExceptions } from '@domain-exceptions/product';
import { Injectable } from '@nestjs/common';
import { ValidatorBase, TranslateOptions } from '@use-cases/common';
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
export abstract class ProductValidator extends ValidatorBase {
  abstract validate(command: ProductUseCaseCommand): ValidationResponse;
  translateExceptionToUserFriendlyMessage(
    options: TranslateOptions,
  ): ValidationExceptionBase {
    const { context, exception } = options;
    switch (context) {
      case ProductIdValueObject.name:
        return new ProductDomainExceptions.IdDoesNotValid();
      case ProductNameValueObject.name:
        return new ProductDomainExceptions.NameDoesNotValid();
      case ProductPriceValueObject.name:
        return new ProductDomainExceptions.PriceDoesNotValid();
      case ProductDescriptionValueObject.name:
        return new ProductDomainExceptions.DescriptionDoesNotValid();
      case ProductImageValueObject.name:
        return new ProductDomainExceptions.ImageDoesNotValid();
      default:
        return exception;
    }
  }

  protected validateProductId(id: string): void {
    const response = ProductIdValueObject.validate(id);
    this.handlerValidationResponse({
      response: response,
      context: ProductIdValueObject.name,
    });
  }

  protected validateName(name: string): void {
    const response = ProductNameValueObject.validate(name);

    this.handlerValidationResponse({
      response: response,
      context: ProductNameValueObject.name,
    });
  }

  protected validatePrice(price: CreateProductPriceValueObjectOptions): void {
    const response = ProductPriceValueObject.validate(price);

    this.handlerValidationResponse({
      response: response,
      context: ProductPriceValueObject.name,
    });
  }

  protected validateDescription(description: string): void {
    const response = ProductDescriptionValueObject.validate(description);

    this.handlerValidationResponse({
      response: response,
      context: ProductDescriptionValueObject.name,
    });
  }

  protected validateImage(image: string): void {
    const response = ProductImageValueObject.validate(image);

    this.handlerValidationResponse({
      response: response,
      context: ProductImageValueObject.name,
    });
  }

  protected validateAttributes(attributes: CreateProductAttributesOptions) {
    const response = ProductAttributesValueObject.validate(attributes);

    this.handlerValidationResponse({
      response: response,
      context: ProductAttributesValueObject.name,
    });
  }
}
