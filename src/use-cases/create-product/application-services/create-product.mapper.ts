import { ProductCreatedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import {
  ProductDescriptionValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import {
  CreateProductCommand,
  CreateProductDomainOptions,
  CreateProductResponseDto,
} from '../dtos';

@Injectable()
export class CreateProductMapper {
  toDomain(command: CreateProductCommand): CreateProductDomainOptions {
    const { name, price, image, description } = command;
    let domainDescription: ProductDescriptionValueObject;
    let domainImage: ProductImageValueObject;

    if (description) {
      domainDescription = new ProductDescriptionValueObject(description);
    }

    if (image) {
      domainImage = new ProductImageValueObject(image);
    }
    return {
      name: new ProductNameValueObject(name),
      price: ProductPriceValueObject.create({
        amount: price.amount,
        currency: price.currency,
      }),
      image: domainImage,
      description: domainDescription,
    };
  }

  toResponseDto(event: ProductCreatedDomainEvent): CreateProductResponseDto {
    const { name, price, image, description } = event.details;
    let descriptionUnpacked: string;
    let imageUnpacked: string;

    if (description) {
      descriptionUnpacked = description.unpack();
    }

    if (image) {
      imageUnpacked = image.unpack();
    }
    return new CreateProductResponseDto({
      productId: event.productId.unpack(),
      name: name.unpack(),
      price: price.unpack(),
      image: imageUnpacked,
      description: descriptionUnpacked,
    });
  }
}
