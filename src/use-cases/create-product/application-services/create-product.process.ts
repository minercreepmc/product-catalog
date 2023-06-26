import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { CreateProductCommand } from '@commands';
import { ProcessBase } from '@base/use-cases';
import { ProductBusinessEnforcer } from '@use-cases/application-services/process';

export type CreateProductProcessSuccess = ProductCreatedDomainEvent;

export type CreateProductProcessFailure =
  Array<ProductDomainExceptions.DoesExist>;

export type CreateProductProcessResult = Result<
  CreateProductProcessSuccess,
  CreateProductProcessFailure
>;

@Injectable()
export class CreateProductProcess extends ProcessBase<
  CreateProductProcessSuccess,
  CreateProductProcessFailure
> {
  execute(command: CreateProductCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: CreateProductCommand,
  ): Promise<void> {
    const { name } = command;

    await this.productEnforcer.productNameMustNotExist(name);
  }

  protected executeMainTask(
    command: CreateProductCommand,
  ): Promise<ProductCreatedDomainEvent> {
    return this.productManagementService.createProduct(command);
  }

  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly productEnforcer: ProductBusinessEnforcer<CreateProductProcessFailure>,
  ) {
    super({
      businessEnforcer: productEnforcer,
    });
  }
}
