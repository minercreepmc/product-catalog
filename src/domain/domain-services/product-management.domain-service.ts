import {
  CreateProductAggregateOptions,
  ProductAggregate,
  UpdateProductAggregateOptions,
} from '@aggregates/product';
import {
  ProductCreatedDomainEvent,
  ProductUpdatedDomainEvent,
} from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';

export type CreateProductDomainServiceOptions = CreateProductAggregateOptions;
export type UpdateProductDomainServiceOptions = {
  id: ProductIdValueObject;
  payload: UpdateProductAggregateOptions;
};

@Injectable()
export class ProductManagementDomainService {
  constructor(
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async isProductExistByName(name: ProductNameValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneByName(name));
  }

  async isProductExistById(id: ProductIdValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneById(id));
  }

  async createProduct(
    options: CreateProductDomainServiceOptions,
  ): Promise<ProductCreatedDomainEvent> {
    let product = await this.productRepository.findOneByName(options.name);
    if (product) {
      throw new ProductDomainExceptions.DoesExist();
    }
    product = new ProductAggregate();
    const productCreatedEvent = product.createProduct(options);
    await this.productRepository.save(product);
    return productCreatedEvent;
  }

  async updateProduct(
    options: UpdateProductDomainServiceOptions,
  ): Promise<ProductUpdatedDomainEvent> {
    const product = await this.productRepository.findOneById(options.id);

    if (!product) {
      throw new ProductDomainExceptions.DoesNotExist();
    }

    const productUpdatedEvent = product.updateProduct(options.payload);
    await this.productRepository.save(product);
    return productUpdatedEvent;
  }
}
