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
import { CommandHandlerBase } from '@base/use-cases/command-handler';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler extends CommandHandlerBase<
  UpdateProductCommand,
  UpdateProductSuccess,
  UpdateProductFailure
> {
  async handle(): Promise<ProductUpdatedDomainEvent> {
    let imageUrl: ProductImageUrlValueObject | undefined;
    if (this.command.image) {
      imageUrl = await this.uploadImage();
    }

    const { command } = this;
    const { id, name, price, description, sold } = command;

    return this.productManagementService.updateProduct({
      id,
      payload: {
        name,
        price,
        image: imageUrl,
        description,
        sold,
      },
    });
  }

  async toResponseDto(
    event: ProductUpdatedDomainEvent,
  ): Promise<UpdateProductResponseDto> {
    return new UpdateProductResponseDto({
      id: event.id?.value,
      name: event.name?.value,
      price: event.price?.value,
      imageUrl: event.image?.value,
      description: event.description?.value,
      sold: event.sold?.value,
    });
  }

  @DefaultCatch((err) => {
    throw err;
  })
  private async uploadImage() {
    const url = await this.uploadService.upload(this.command.image!);
    const imageUrl = new ProductImageUrlValueObject(url);
    return imageUrl;
  }

  protected command: UpdateProductCommand;
  constructor(
    validator: UpdateProductValidator,
    private readonly uploadService: UploadService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super(validator);
  }
}
