import { ProcessBase } from '@base/use-cases';
import { UpdateProductCommand } from '@commands';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { UploadService } from '@infrastructures/cloud';
import { Injectable } from '@nestjs/common';
import { ProductBusinessEnforcer } from '@use-cases/shared/application-services/process';
import { FileValueObject } from '@value-objects/common';
import { ProductImageUrlValueObject } from '@value-objects/product';

export type UpdateProductProcessSuccess = ProductUpdatedDomainEvent;
export type UpdateProductProcessFailure =
  Array<ProductDomainExceptions.DoesNotExist>;

@Injectable()
export class UpdateProductProcess extends ProcessBase<
  UpdateProductProcessSuccess,
  UpdateProductProcessFailure
> {
  private imageUrl: ProductImageUrlValueObject;

  protected async enforceBusinessRules(
    command: UpdateProductCommand,
  ): Promise<void> {
    const { productId, image } = command;

    await this.productEnforcer.productIdMustExist(productId);

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
    command: UpdateProductCommand,
  ): Promise<ProductUpdatedDomainEvent> {
    return this.productManagementService.updateProduct({
      id: command.productId,
      payload: {
        name: command.name,
        description: command.description,
        price: command.price,
        image: this.imageUrl,
      },
    });
  }

  constructor(
    private readonly productManagementService: ProductManagementDomainService,
    private readonly uploadService: UploadService,
    private readonly productEnforcer: ProductBusinessEnforcer<UpdateProductProcessFailure>,
  ) {
    super({
      businessEnforcer: productEnforcer,
    });
  }
}
