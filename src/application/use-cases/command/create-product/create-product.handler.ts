import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductManagementDomainService } from '@domain-services';
import { UploadService } from '@infrastructures/cloud';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProductImageUrlValueObject } from '@value-objects/product';
import { DefaultCatch } from 'catch-decorator-ts';
import { Err, Ok } from 'oxide.ts';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from './create-product.dto';
import {
  CreateProductValidator,
  CreateProductResult,
} from './create-product.validator';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, CreateProductResult>
{
  @DefaultCatch((err) => {
    throw err;
  })
  async execute(command: CreateProductCommand): Promise<CreateProductResult> {
    this.command = command;
    const result = await this.validator.validate(command);

    if (result.hasExceptions()) {
      return Err(result.getExceptions());
    }

    let imageUrl: ProductImageUrlValueObject;

    if (command.image) {
      imageUrl = await this.uploadImage();
    }
    const productCreated = await this.createProduct(imageUrl);

    return Ok(
      new CreateProductResponseDto({
        id: productCreated.id?.value,
        price: productCreated.price?.value,
        name: productCreated.name?.value,
        description: productCreated.description?.value,
        imageUrl: productCreated.image?.value,
      }),
    );
  }

  @DefaultCatch((err) => {
    throw err;
  })
  private async uploadImage() {
    const url = await this.uploadService.upload(this.command.image);
    const imageUrl = ProductImageUrlValueObject.create(url);
    return imageUrl;
  }

  private createProduct(
    imageUrl?: ProductImageUrlValueObject,
  ): Promise<ProductCreatedDomainEvent> {
    return this.productManagementService.createProduct({
      name: this.command.name,
      price: this.command.price,
      description: this.command.description,
      image: imageUrl,
    });
  }

  private command: CreateProductCommand;
  constructor(
    private readonly validator: CreateProductValidator,
    private readonly uploadService: UploadService,
    private readonly productManagementService: ProductManagementDomainService,
  ) {}
}
