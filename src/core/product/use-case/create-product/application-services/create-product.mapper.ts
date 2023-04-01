import { Injectable } from '@nestjs/common';
import { ProductCreatedDomainEvent } from '@product-domain/domain-events';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import {
  CreateProductCommand,
  CreateProductDomainOptions,
  CreateProductResponseDto,
} from '../dtos';

@Injectable()
export class CreateProductMapper {
  toDomain(command: CreateProductCommand): CreateProductDomainOptions {
    return {
      name: new ProductNameValueObject(command.name),
      price: ProductPriceValueObject.create({
        amount: command.price.amount,
        currency: command.price.currency,
      }),
    };
  }

  toResponseDto(event: ProductCreatedDomainEvent): CreateProductResponseDto {
    const { name, price } = event.details;
    return new CreateProductResponseDto({
      productId: event.productId.unpack(),
      name: name.unpack(),
      price: price.unpack(),
    });
  }
}
