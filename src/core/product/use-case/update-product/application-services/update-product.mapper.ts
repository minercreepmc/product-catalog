/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ProductUpdatedDomainEvent } from '@product-domain/domain-events';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
  UpdateProductDomainOptions,
} from '../dtos';

@Injectable()
export class UpdateProductMapper {
  toDomain(command: UpdateProductCommand): UpdateProductDomainOptions {
    const { name, price, image, description } = command;
    let domainName: ProductNameValueObject;
    let domainPrice: ProductPriceValueObject;
    let domainImage: ProductImageValueObject;
    let domainDescription: ProductDescriptionValueObject;
    if (price) {
      domainPrice = ProductPriceValueObject.create(price);
    }

    if (name) {
      domainName = new ProductNameValueObject(name);
    }

    if (image) {
      domainImage = new ProductImageValueObject(image);
    }

    if (description) {
      domainDescription = new ProductDescriptionValueObject(description);
    }

    return {
      id: new ProductIdValueObject(command.productId),
      payload: {
        name: domainName,
        price: domainPrice,
        description: domainDescription,
        image: domainImage,
      },
    };
  }

  toResponseDto(event: ProductUpdatedDomainEvent): UpdateProductResponseDto {
    const { name, price, image, description } = event.details;
    let nameUnpacked: string;
    let priceUnpacked: { amount: number; currency: string };
    let descriptionUnpacked: string;
    let imageUnpacked: string;

    if (name) {
      nameUnpacked = name.unpack();
    }
    if (price) {
      priceUnpacked = price.unpack();
    }

    if (image) {
      imageUnpacked = image.unpack();
    }
    if (description) {
      descriptionUnpacked = description.unpack();
    }
    return {
      productId: event.productId.unpack(),
      name: nameUnpacked,
      price: priceUnpacked,
      image: imageUnpacked,
      description: descriptionUnpacked,
    };
  }
}
