import {
  CreateProductAggregateOptions,
  ProductAggregate,
  UpdateProductAggregateOptions,
} from '@aggregates/product';
import {
  ProductCreatedDomainEvent,
  ProductRemovedDomainEvent,
  ProductUpdatedDomainEvent,
} from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';
import { DefaultCatch } from 'catch-decorator-ts';

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
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async doesProductExistByName(name: ProductNameValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneByName(name));
  }

  async doesProductExistById(id: ProductIdValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneById(id));
  }

  async doesProductIdsExist(ids: ProductIdValueObject[]): Promise<boolean> {
    if (!ids || ids.length === 0) {
      return true;
    }

    const checks = await Promise.all(
      ids.map((id) => this.productRepository.findOneById(id)),
    );

    return checks.every((exist) => exist);
  }

  async getProductById(id: ProductIdValueObject): Promise<ProductAggregate> {
    return this.productRepository.findOneById(id);
  }

  async createProduct(
    options: CreateProductDomainServiceOptions,
  ): Promise<ProductCreatedDomainEvent> {
    let product = await this.productRepository.findOneByName(options.name);
    if (product) {
      throw new ProductDomainExceptions.AlreadyExist();
    }
    product = new ProductAggregate();
    const productCreatedEvent = product.createProduct(options);
    await this.productRepository.create(product);
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
    await this.productRepository.updateOneById(options.id, product);
    return productUpdatedEvent;
  }

  async removeProduct(
    id: ProductIdValueObject,
  ): Promise<ProductRemovedDomainEvent> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new ProductDomainExceptions.DoesNotExist();
    }
    await this.productRepository.deleteOneById(id);

    return new ProductRemovedDomainEvent({
      id: id,
    });
  }

  async removeProducts(
    ids: ProductIdValueObject[],
  ): Promise<ProductRemovedDomainEvent[]> {
    const products: ProductAggregate[] = [];

    const isExist = await this.doesProductIdsExist(ids);

    if (!isExist) {
      throw new ProductDomainExceptions.DoesNotExist();
    }

    for (const id of ids) {
      products.push(await this.productRepository.findOneById(id));
    }

    const productsRemoved = products.map((product) => product.removeProduct());

    for (const id of ids) {
      await this.productRepository.deleteOneById(id);
    }

    return productsRemoved;
  }
}
