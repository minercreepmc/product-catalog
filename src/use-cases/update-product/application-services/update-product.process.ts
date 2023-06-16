import { ProcessBase } from '@base/use-cases';
import { UpdateProductCommand } from '@commands';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';

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

  async execute(command: UpdateProductCommand) {
    const { productId } = command;
    this.init();
    await this.validateIdMustExist(productId);
    await this.updateProductIfIdExist(command);
    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.clearValue();
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

  protected async updateProductIfIdExist(command: UpdateProductCommand) {
    if (this.idExist) {
      const productUpdated = await this.productManagementService.updateProduct({
        id: command.productId,
        payload: {
          name: command.name,
          description: command.description,
          price: command.price,
          image: command.image,
        },
      });
      this.value = productUpdated;
    }
  }
}
