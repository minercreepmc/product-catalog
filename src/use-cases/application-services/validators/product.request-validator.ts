import { TranslateOptions, RequestValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from '@use-cases/create-product/dtos';
import { UpdateProductRequestDto } from '@use-cases/update-product/dtos';
import {
  CreateProductAttributesOptions,
  CreateProductPriceValueObjectOptions,
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ValidationExceptionBase } from 'common-base-classes';

export type ProductRequestDto =
  | CreateProductRequestDto
  | UpdateProductRequestDto;

@Injectable()
export class ProductRequestValidator extends RequestValidatorBase {
  _validate(requestDto: ProductRequestDto): void {
    const { image, description, price, name } = requestDto;
    if (name) {
      this.validateName(name);
    }
    if (price) {
      this.validatePrice(price);
    }
    if (description) {
      this.validateDescription(description);
    }
    if (image) {
      this.validateImage(image);
    }
  }
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

  validateProductId(id: string): void {
    const response = ProductIdValueObject.validate(id);
    this.handlerValidationResponse({
      response: response,
      context: ProductIdValueObject.name,
    });
  }

  validateName(name: string): void {
    const response = ProductNameValueObject.validate(name);

    this.handlerValidationResponse({
      response: response,
      context: ProductNameValueObject.name,
    });
  }

  validatePrice(price: CreateProductPriceValueObjectOptions): void {
    const response = ProductPriceValueObject.validate(price);

    this.handlerValidationResponse({
      response: response,
      context: ProductPriceValueObject.name,
    });
  }

  validateDescription(description: string): void {
    const response = ProductDescriptionValueObject.validate(description);

    this.handlerValidationResponse({
      response: response,
      context: ProductDescriptionValueObject.name,
    });
  }

  validateImage(image: string): void {
    const response = ProductImageValueObject.validate(image);

    this.handlerValidationResponse({
      response: response,
      context: ProductImageValueObject.name,
    });
  }

  validateAttributes(attributes: CreateProductAttributesOptions) {
    const response = ProductAttributesValueObject.validate(attributes);

    this.handlerValidationResponse({
      response: response,
      context: ProductAttributesValueObject.name,
    });
  }

  validateReason(reason: string): void {
    const response = RejectionReasonValueObject.validate(reason);

    return this.handlerValidationResponse({
      response,
      context: RejectionReasonValueObject.name,
    });
  }
}
