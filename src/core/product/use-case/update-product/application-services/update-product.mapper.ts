import { Injectable } from '@nestjs/common';
import { ProductUpdatedDomainEvent } from '@product-domain/domain-events';
import {
  ProductIdValueObject,
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
    const { id, name, price } = command;
    let nameValueObject: ProductNameValueObject;
    let priceValueObject: ProductPriceValueObject;
    if (price) {
      priceValueObject = ProductPriceValueObject.create(price);
    }

    if (name) {
      nameValueObject = new ProductNameValueObject(name);
    }

    return {
      id: new ProductIdValueObject(id),
      payload: {
        name: nameValueObject,
        price: priceValueObject,
      },
    };
  }

  toResponseDto(event: ProductUpdatedDomainEvent): UpdateProductResponseDto {
    return {
      name: event.details.name.unpack(),
      price: event.details.price.unpack(),
    };
  }
}
