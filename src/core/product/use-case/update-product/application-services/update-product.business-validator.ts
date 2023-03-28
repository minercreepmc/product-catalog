import { Injectable } from '@nestjs/common';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import { ProductUseCaseBusinessValidator } from '@product-use-case/application-services';
import { ValidationException, ValidationResponse } from 'common-base-classes';
import { UpdateProductDomainOptions } from '../dtos';

@Injectable()
export class UpdateProductBusinessValidator extends ProductUseCaseBusinessValidator {
  constructor(productManagementService: ProductManagementDomainService) {
    super(productManagementService);
  }

  exceptions: ValidationException[] = [];
  async validate(
    domainOptions: UpdateProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { payload } = domainOptions;
    this.clearExceptions();
    await this.validateNameMustExist(payload.name);
    return this.getValidationResponse();
  }
}
