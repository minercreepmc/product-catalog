import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { BusinessValidatorBase } from '@use-cases/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';
import { ValidationResponse } from 'common-base-classes';

export abstract class ProductBusinessValidator extends BusinessValidatorBase {
  abstract validate(domainOptions: any): Promise<ValidationResponse>;

  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }

  protected async validateNameMustNotExist(
    name: ProductNameValueObject,
  ): Promise<void> {
    const productExists =
      await this.productManagementService.isProductExistByName(name);
    if (productExists) {
      this.exceptions.push(new ProductDomainExceptions.DoesExist());
    }
  }

  protected async validateIdMustExist(id: ProductIdValueObject): Promise<void> {
    const productExists = await this.productManagementService.isProductExistById(
      id,
    );
    if (!productExists) {
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }
}
