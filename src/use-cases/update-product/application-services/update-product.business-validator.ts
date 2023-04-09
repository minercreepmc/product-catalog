import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProductBusinessValidator } from '@use-cases/application-services/business-validators';
import { ValidationResponse } from 'common-base-classes';
import { UpdateProductDomainOptions } from '../dtos';

@Injectable()
export class UpdateProductBusinessValidator extends ProductBusinessValidator {
  constructor(productManagementService: ProductManagementDomainService) {
    super(productManagementService);
  }
  async execute(
    options: UpdateProductDomainOptions,
  ): Promise<ValidationResponse> {
    const { id } = options;
    this.clearExceptions();
    await this.validateIdMustExist(id);
    return this.getValidationResult();
  }
}
