import { ProcessBase } from '@base/use-cases';
import { RemoveProductsCommand } from '@commands/remove-products.command';
import { ProductRemovedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { ProductBusinessEnforcer } from '@use-cases/shared/application-services/process';
import { Result } from 'oxide.ts/dist';

export type RemoveProductsProcessSuccess = ProductRemovedDomainEvent[];

export type RemoveProductsProcessFailure =
  Array<ProductDomainExceptions.DoesNotExist>;

export type RemoveProductProcessResult = Result<
  RemoveProductsProcessSuccess,
  RemoveProductsProcessFailure
>;

@Injectable()
export class RemoveProductsProcess extends ProcessBase<
  RemoveProductsProcessSuccess,
  RemoveProductsProcessFailure
> {
  protected async enforceBusinessRules(
    command: RemoveProductsCommand,
  ): Promise<void> {
    const { ids } = command;

    const promises = ids.map((id) =>
      this.productBusinessEnforcer.productIdMustExist(id),
    );
    await Promise.all(promises);
  }
  protected executeMainTask(
    command: RemoveProductsCommand,
  ): Promise<RemoveProductsProcessSuccess> {
    const { ids } = command;

    const promises = ids.map((id) =>
      this.productManagementService.removeProduct(id),
    );

    return Promise.all(promises);
  }

  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly productBusinessEnforcer: ProductBusinessEnforcer<RemoveProductsProcessFailure>,
  ) {
    super({
      businessEnforcer: productBusinessEnforcer,
    });
  }
}
