import { ProductManagementDomainService } from '@domain-services';
import { CommandHandler } from '@nestjs/cqrs';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from './update-product.dto';
import {
  UpdateProductFailure,
  UpdateProductSuccess,
  UpdateProductValidator,
} from './update-product.validator';
import { DefaultCatch } from 'catch-decorator-ts';
import { ProductImageUrlValueObject } from '@value-objects/product';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { UploadService } from '@infrastructures/cloud';
import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler extends CommandHandlerBase<
  UpdateProductCommand,
  UpdateProductSuccess,
  UpdateProductFailure
> {
  async handle(): Promise<ProductUpdatedDomainEvent> {
    let imageUrl: ProductImageUrlValueObject;
    if (this.command.image) {
      imageUrl = await this.uploadImage();
    }
    return this.updateProduct(imageUrl);
  }
  async validate(): Promise<void> {
    const result = await this.validator.validate(this.command);
    if (result.hasExceptions()) {
      throw result.getExceptions();
    }
  }

  toResponseDto(event: ProductUpdatedDomainEvent): UpdateProductResponseDto {
    return new UpdateProductResponseDto({
      id: event.id?.value,
      name: event.name?.value,
      price: event.price?.value,
      imageUrl: event.image?.value,
      description: event.description?.value,
    });
  }

  @DefaultCatch((err) => {
    throw err;
  })
  private async uploadImage() {
    const url = await this.uploadService.upload(this.command.image);
    const imageUrl = ProductImageUrlValueObject.create(url);
    return imageUrl;
  }

  private updateProduct(
    imageUrl?: ProductImageUrlValueObject,
  ): Promise<ProductUpdatedDomainEvent> {
    return this.productManagementService.updateProduct({
      id: this.command.id,
      payload: {
        name: this.command.name,
        price: this.command.price,
        image: imageUrl,
        description: this.command.description,
      },
    });
  }

  protected command: UpdateProductCommand;
  constructor(
    private readonly validator: UpdateProductValidator,
    private readonly uploadService: UploadService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super();
  }
}
