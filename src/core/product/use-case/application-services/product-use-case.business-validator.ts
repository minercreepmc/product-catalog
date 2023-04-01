import { BusinessValidatorBase } from '@common-use-case/business-validator.base';
import { ProductDomainException } from '@product-domain/domain-exceptions';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@product-domain/value-objects';
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
      await this.productManagementService.isProductNameExist(name);
    if (productExists) {
      this.exceptions.push(new ProductDomainException.IsExist());
    }
  }

  protected async validateIdMustExist(id: ProductIdValueObject): Promise<void> {
    const productExists = await this.productManagementService.isProductIdExist(
      id,
    );
    if (!productExists) {
      this.exceptions.push(new ProductDomainException.IsNotExist());
    }
  }

}
