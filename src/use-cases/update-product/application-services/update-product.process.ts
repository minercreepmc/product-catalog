import { ProcessBase } from '@base/use-cases';
import { UpdateProductCommand } from '@commands';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProductBusinessEnforcer } from '@use-cases/application-services/process';

export type UpdateProductProcessSuccess = ProductUpdatedDomainEvent;
export type UpdateProductProcessFailure =
  Array<ProductDomainExceptions.DoesNotExist>;

@Injectable()
export class UpdateProductProcess extends ProcessBase<
  UpdateProductProcessSuccess,
  UpdateProductProcessFailure
> {
  protected async enforceBusinessRules(
    command: UpdateProductCommand,
  ): Promise<void> {
    const { productId } = command;

    await this.productEnforcer.productIdMustExist(productId);
  }
  protected executeMainTask(
    command: UpdateProductCommand,
  ): Promise<ProductUpdatedDomainEvent> {
    return this.productManagementService.updateProduct({
      id: command.productId,
      payload: {
        name: command.name,
        description: command.description,
        price: command.price,
        image: command.image,
      },
    });
  }

  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly productEnforcer: ProductBusinessEnforcer<UpdateProductProcessFailure>,
  ) {
    super({
      businessEnforcer: productEnforcer,
    });
  }
}
