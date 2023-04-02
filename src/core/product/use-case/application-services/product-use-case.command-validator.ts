import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@common-use-case';
import { ICommand } from '@nestjs/cqrs';
import { ProductDomainException } from '@product-domain/domain-exceptions';
import {
  CreateProductAttributesOptions,
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
} from '@product-domain/value-objects';
import {
  CreateProductPriceValueObjectOptions,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import {
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';

export abstract class ProductCommandValidator extends CommandValidatorBase {
  abstract validate(command: ICommand): ValidationResponse;

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
