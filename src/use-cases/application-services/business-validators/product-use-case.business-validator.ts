import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { ProcessBase } from '@use-cases/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';
import { Result } from 'oxide.ts';

export abstract class ProductBusinessValidator<
  Success,
  Failures extends any[],
> extends ProcessBase<Success, Failures> {
  abstract execute(domainOptions: any): Promise<Result<Success, Failures>>;

  constructor(
    protected readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }

  nameExist: boolean;
  idExist: boolean;

  protected async validateNameMustNotExist(
    name: ProductNameValueObject,
  ): Promise<void> {
    const productExists =
      await this.productManagementService.isProductExistByName(name);
    if (productExists) {
      this.nameExist = true;
      this.exceptions.push(new ProductDomainExceptions.DoesExist());
    }
  }

  protected async validateIdMustExist(id: ProductIdValueObject): Promise<void> {
    const productExists =
      await this.productManagementService.isProductExistById(id);
    if (!productExists) {
      this.idExist = false;
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }
}
