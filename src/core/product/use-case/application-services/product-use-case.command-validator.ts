import {
  CommandValidatorBase,
  TranslateExceptionToUserFriendlyMessageOptions,
} from '@common-use-case';
import { ICommand } from '@nestjs/cqrs';
import { ProductDomainException } from '@product-domain/domain-exceptions';
import {
  ProductIdValueObject,
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
    if (context === ProductIdValueObject.name) {
      return new ProductDomainException.IdIsNotValid();
    }

    if (context === ProductNameValueObject.name) {
      return new ProductDomainException.NameIsNotValid();
    }

    if (context === ProductPriceValueObject.name) {
      return new ProductDomainException.PriceIsNotValid();
    }

    return exception;
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
}
