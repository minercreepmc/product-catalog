import { Injectable } from '@nestjs/common';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { ProductBusinessValidator } from '@product-use-case/application-services';
import { ValidationResponse } from 'common-base-classes';
import { UpdateProductDomainOptions } from '../dtos';

@Injectable()
export class UpdateProductBusinessValidator extends ProductBusinessValidator {
  constructor(productManagementService: ProductManagementDomainService) {
    super(productManagementService);
  }
  async validate(
    domainOptions: UpdateProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { payload } = domainOptions;
    this.clearExceptions();
    await this.validateNameMustExist(payload.name);
    return this.getValidationResponse();
  }
}
