import { TranslateOptions, RequestValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from '@use-cases/command/create-product/dtos';
import { RemoveProductsRequestDto } from '@use-cases/command/remove-products/dtos';
import { UpdateProductRequestDto } from '@use-cases/command/update-product/dtos';
import { FileValueObject } from '@value-objects/common';
import {
  CreateProductAttributesOptions,
  CreateProductPriceValueObjectOptions,
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ValidationExceptionBase } from 'common-base-classes';

export type ProductRequestDto =
  | CreateProductRequestDto
  | UpdateProductRequestDto
  | RemoveProductsRequestDto;

@Injectable()
export class ProductRequestValidator extends RequestValidatorBase {
  _validate(requestDto: ProductRequestDto): void {
    throw new Error('Method not implemented.');
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
      case FileValueObject.name:
        return new ProductDomainExceptions.ImageDoesNotValid();
      case RejectionReasonValueObject.name:
        return new ProductDomainExceptions.RejectionReasonDoesNotValid();
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

  validateImage(image: Express.Multer.File): void {
    const response = FileValueObject.validate({
      name: image.originalname,
      buffer: image.buffer,
    });

    return this.handlerValidationResponse({
      response,
      context: FileValueObject.name,
    });
  }
}
