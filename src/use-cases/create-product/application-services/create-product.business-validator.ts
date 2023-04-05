import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProductBusinessValidator } from '@use-cases/application-services/business-validators';
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
