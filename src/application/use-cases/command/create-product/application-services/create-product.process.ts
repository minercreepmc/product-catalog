import { ProductManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { CreateProductCommand } from '@commands';
import { ProcessBase } from '@base/use-cases';
import { UploadService } from '@infrastructures/cloud';
import { ProductImageUrlValueObject } from '@value-objects/product';
import { FileValueObject } from '@value-objects/common';
import { ProductBusinessEnforcer } from '@use-cases/shared/application-services/process';

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
  private imageUrl: ProductImageUrlValueObject;

  execute(command: CreateProductCommand) {
    return super.execute(command);
  }

  protected async enforceBusinessRules(
    command: CreateProductCommand,
  ): Promise<void> {
    const { name, image } = command;

    await this.productEnforcer.productNameMustNotExist(name);

    if (image && this.hasNoExceptions()) {
      await this.uploadImage(image);
    }
  }

  private async uploadImage(image: FileValueObject) {
    try {
      const url = await this.uploadService.upload(image);
      this.imageUrl = new ProductImageUrlValueObject(url);
    } catch (exceptions) {
      this.exceptions.push(exceptions);
    }
  }

  protected executeMainTask(
    command: CreateProductCommand,
  ): Promise<ProductCreatedDomainEvent> {
    const { name, price, description } = command;
    return this.productManagementService.createProduct({
      name,
      price,
      description,
      image: this.imageUrl,
    });
  }

  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly uploadService: UploadService,
    private readonly productEnforcer: ProductBusinessEnforcer<CreateProductProcessFailure>,
  ) {
    super({
      businessEnforcer: productEnforcer,
    });
  }
}
