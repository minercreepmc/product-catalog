import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CreateProductDomainOptions } from '../dtos';
import { Result } from 'oxide.ts';
import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProcessBase } from '@use-cases/common';
import { ProductNameValueObject } from '@value-objects/product';

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
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }

  private nameExist: boolean;

  async execute(
    domainOptions: CreateProductDomainOptions,
  ): Promise<CreateProductProcessResult> {
    const { name } = domainOptions;

    this.init();
    await this.validateNameMustNotExist(name);
    await this.createProductIfNameNotExist(domainOptions);

    return this.getValidationResult();
  }

  protected init(): void {
    this.clearExceptions();
    this.clearValue();
    this.nameExist = false;
  }

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

  private async createProductIfNameNotExist(
    domainOptions: CreateProductDomainOptions,
  ) {
    if (!this.nameExist) {
      const productCreatedEvent =
        await this.productManagementService.createProduct(domainOptions);
      this.value = productCreatedEvent;
    }
  }
}
