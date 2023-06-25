import { ProductAggregate } from '@aggregates/product';
import { BusinessRulesEnforcer } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';

export type ProductProcessFailures = Array<
  | ProductDomainExceptions.DoesNotExist
  | ProductDomainExceptions.DoesExist
  | ProductDomainExceptions.NotSubmittedForApproval
>;

export class ProductBusinessEnforcer<
  Failures extends ProductProcessFailures,
> extends BusinessRulesEnforcer<Failures> {
  private product: ProductAggregate;
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }

  async productNameMustNotExist(name: ProductNameValueObject): Promise<void> {
    const productExists =
      await this.productManagementService.isProductExistByName(name);
    if (productExists) {
      this.exceptions.push(new ProductDomainExceptions.DoesExist());
    }
  }

  async productIdMustExist(productId: ProductIdValueObject) {
    const product = await this.productManagementService.getProductById(
      productId,
    );
    if (!product) {
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    } else {
      this.product = product;
    }
  }

  productMustBeSubmittedForApproval() {
    if (!this.product) {
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    } else if (!this.product.status.isPendingApproval()) {
      this.exceptions.push(
        new ProductDomainExceptions.NotSubmittedForApproval(),
      );
    }
  }
}
