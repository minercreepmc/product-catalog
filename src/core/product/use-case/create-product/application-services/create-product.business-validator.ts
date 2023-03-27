import { Injectable } from '@nestjs/common';
import { ProductDomainException } from '@product-domain/domain-exceptions';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { ProductNameValueObject } from '@product-domain/value-objects';
import { ValidationException, ValidationResponse } from 'common-base-classes';
import { CreateProductDomainOptions } from '../dtos';

@Injectable()
export class CreateProductBusinessValidator {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {}

  exceptions: ValidationException[] = [];

  async validate(
    domainOptions: CreateProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { name } = domainOptions;

    this.clearExceptions();
    await this.validateNameMustNotExist(name);
    return this.getValidationResponse();
  }

  private clearExceptions() {
    this.exceptions = [];
  }

  private async validateNameMustNotExist(
    name: ProductNameValueObject,
  ): Promise<void> {
    const productExists = await this.productManagementService.isProductExist(
      name,
    );
    if (productExists) {
      this.exceptions.push(new ProductDomainException.IsExist());
    }
  }

  private getValidationResponse(): ValidationResponse {
    if (this.exceptions.length > 0) {
      return ValidationResponse.fail(this.exceptions);
    } else {
      return ValidationResponse.success();
    }
  }
}
