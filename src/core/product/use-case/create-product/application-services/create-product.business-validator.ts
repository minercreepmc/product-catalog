import { Injectable } from '@nestjs/common';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { ProductBusinessValidator } from '@product-use-case/application-services';
import { ValidationResponse } from 'common-base-classes';
import { CreateProductDomainOptions } from '../dtos';

@Injectable()
export class CreateProductBusinessValidator extends ProductBusinessValidator {
  constructor(productManagementService: ProductManagementDomainService) {
    super(productManagementService);
  }

  async validate(
    domainOptions: CreateProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { name } = domainOptions;

    this.clearExceptions();
    await this.validateNameMustNotExist(name);
    return this.getValidationResponse();
  }
}
