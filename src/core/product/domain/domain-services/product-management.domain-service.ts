import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductAggregateOptions,
  ProductAggregate,
  UpdateProductAggregateOptions,
} from '@product-domain/aggregate';
import {
  ProductCreatedDomainEvent,
  ProductUpdatedDomainEvent,
} from '@product-domain/domain-events';
import { ProductDomainException } from '@product-domain/domain-exceptions/product.domain-exception';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@product-domain/interfaces';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@product-domain/value-objects';

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

  async isProductNameExist(name: ProductNameValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneByName(name));
  }

  async isProductIdExist(id: ProductIdValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneById(id));
  }

  async createProduct(
    options: CreateProductDomainServiceOptions,
  ): Promise<ProductCreatedDomainEvent> {
    let product = await this.productRepository.findOneByName(options.name);
    if (product) {
      throw new ProductDomainException.IsExist();
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
      throw new ProductDomainException.IsNotExist();
    }

    const productUpdatedEvent = product.updateProduct(options.payload);
    await this.productRepository.save(product);
    return productUpdatedEvent;
  }
}
