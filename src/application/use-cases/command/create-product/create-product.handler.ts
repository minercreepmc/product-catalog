import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductManagementDomainService } from '@domain-services';
import { UploadService } from '@infrastructures/cloud';
import { CommandHandler } from '@nestjs/cqrs';
import { ProductImageUrlValueObject } from '@value-objects/product';
import { DefaultCatch } from 'catch-decorator-ts';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from './create-product.dto';
import {
  CreateProductValidator,
  CreateProductSuccess,
  CreateProductFailure,
} from './create-product.validator';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler extends CommandHandlerBase<
  CreateProductCommand,
  CreateProductSuccess,
  CreateProductFailure
> {
  async handle(): Promise<ProductCreatedDomainEvent> {
    const { command } = this;
    let imageUrl: ProductImageUrlValueObject;

    if (command.image) {
      imageUrl = await this.uploadImage();
    }

    return this.productManagementService.createProduct({
      name: this.command.name,
      price: this.command.price,
      description: this.command.description,
      discountId: this.command.discountId,
      categoryIds: this.command.categoryIds,
      image: imageUrl,
    });
  }

  toResponseDto(data: ProductCreatedDomainEvent): CreateProductResponseDto {
    return new CreateProductResponseDto({
      id: data.id?.value,
      price: data.price?.value,
      name: data.name?.value,
      description: data.description?.value,
      imageUrl: data.image?.value,
      categoryIds: data.categoryIds?.map((id) => id?.value),
      discountId: data.discountId?.value,
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

  protected command: CreateProductCommand;
  constructor(
    validator: CreateProductValidator,
    private readonly uploadService: UploadService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {
    super(validator);
  }
}
