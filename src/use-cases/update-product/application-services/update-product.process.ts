import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProcessBase } from '@use-cases/common';
import { ProductIdValueObject } from '@value-objects/product';
import { UpdateProductDomainOptions } from '../dtos';

export type UpdateProductProcessSuccess = ProductUpdatedDomainEvent;
export type UpdateProductProcessFailure =
  Array<ProductDomainExceptions.DoesNotExist>;

@Injectable()
export class UpdateProductProcess extends ProcessBase<
  UpdateProductProcessSuccess,
  UpdateProductProcessFailure
> {
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }
  private idExist: boolean;

  async execute(options: UpdateProductDomainOptions) {
    const { id } = options;
    this.init();
    await this.validateIdMustExist(id);
    await this.updateProductIfIdExist(options);
    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.idExist = true;
  }

  protected async validateIdMustExist(id: ProductIdValueObject): Promise<void> {
    const productExists =
      await this.productManagementService.isProductExistById(id);
    if (!productExists) {
      this.idExist = false;
      this.exceptions.push(new ProductDomainExceptions.DoesNotExist());
    }
  }

  protected async updateProductIfIdExist(options: UpdateProductDomainOptions) {
    if (this.idExist) {
      const productUpdated = await this.productManagementService.updateProduct(
        options,
      );
      this.value = productUpdated;
    }
  }
}
