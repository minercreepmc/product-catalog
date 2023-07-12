import { CommandMapperBase } from '@base/use-cases';
import { CreateProductCommand } from '@commands';
import { ProductCreatedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import { FileValueObject } from '@value-objects/common';
import {
  ProductDescriptionValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { CreateProductRequestDto, CreateProductResponseDto } from '../dtos';

@Injectable()
export class CreateProductMapper extends CommandMapperBase<CreateProductResponseDto> {
  toCommand(dto: CreateProductRequestDto): CreateProductCommand {
    const { name, price, image, description } = dto;
    let domainDescription: ProductDescriptionValueObject;
    let domainImage: FileValueObject;

    if (description) {
      domainDescription = new ProductDescriptionValueObject(description);
    }

    if (image) {
      domainImage = new FileValueObject({
        name: image.originalname,
        buffer: image.buffer,
      });
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
      imageUrl: imageUnpacked,
      description: descriptionUnpacked,
    });
  }
}
