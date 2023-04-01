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
    options: UpdateProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { id } = options;
    this.clearExceptions();
    await this.validateIdMustExist(id);
    return this.getValidationResponse();
  }
}
