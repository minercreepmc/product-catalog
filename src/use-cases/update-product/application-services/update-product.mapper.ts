/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseCaseMapperBase } from '@base/use-cases';
import { UpdateProductCommand } from '@commands';
import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import {
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { UpdateProductRequestDto, UpdateProductResponseDto } from '../dtos';

@Injectable()
export class UpdateProductMapper extends UseCaseMapperBase<UpdateProductResponseDto> {
  toCommand(dto: UpdateProductRequestDto): UpdateProductCommand {
    const { name, price, image, description } = dto;
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

    return new UpdateProductCommand({
      productId: new ProductIdValueObject(dto.id),
      name: domainName,
      price: domainPrice,
      description: domainDescription,
      image: domainImage,
    });
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
    return new UpdateProductResponseDto({
      id: event.productId.unpack(),
      name: nameUnpacked,
      price: priceUnpacked,
      image: imageUnpacked,
      description: descriptionUnpacked,
    });
  }
}
