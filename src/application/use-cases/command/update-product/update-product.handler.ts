import { ProductManagementDomainService } from '@domain-services';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok } from 'oxide.ts';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from './update-product.dto';
import {
  UpdateProductResult,
  UpdateProductValidator,
} from './update-product.validator';
import { DefaultCatch } from 'catch-decorator-ts';
import { ProductImageUrlValueObject } from '@value-objects/product';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { UploadService } from '@infrastructures/cloud';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand, UpdateProductResult>
{
  @DefaultCatch((err) => Err(err))
  async execute(command: UpdateProductCommand): Promise<UpdateProductResult> {
    this.command = command;
    const result = await this.validator.validate(command);
    if (result.hasExceptions()) {
      return Err(result.getExceptions());
    }

    let imageUrl: ProductImageUrlValueObject;
    if (command.image) {
      imageUrl = await this.uploadImage();
    }
    const productUpdated = await this.updateProduct(imageUrl);

    return Ok(this.toResponseDto(productUpdated));
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

  private toResponseDto(
    event: ProductUpdatedDomainEvent,
  ): UpdateProductResponseDto {
    return new UpdateProductResponseDto({
      id: event.id?.value,
      name: event.name?.value,
      price: event.price?.value,
      imageUrl: event.image?.value,
      description: event.description?.value,
    });
  }

  private command: UpdateProductCommand;
  constructor(
    private readonly validator: UpdateProductValidator,
    private readonly uploadService: UploadService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {}
}
