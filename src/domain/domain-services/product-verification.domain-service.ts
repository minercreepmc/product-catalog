import { ProductAggregate } from '@aggregates/product';
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

@Injectable()
export class ProductVerificationDomainService {
  constructor(
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
  ) {}
  async doesProductNameExist(name: ProductNameValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneByName(name));
  }

  async doesProductIdExist(id: ProductIdValueObject): Promise<boolean> {
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

  async findProductAndThrowIfExist(name: ProductNameValueObject) {
    const product = await this.productRepository.findOneByName(name);
    if (product) throw new ProductDomainExceptions.AlreadyExist();
  }

  async findProductOrThrow(id: ProductIdValueObject) {
    const product = await this.productRepository.findOneById(id);
    if (!product) throw new ProductDomainExceptions.DoesNotExist();
    return product;
  }

  async findProductsOrThrow(ids: ProductIdValueObject[]) {
    const products: ProductAggregate[] = [];

    for (const id of ids) {
      const product = await this.productRepository.findOneById(id);
      if (!product) throw new ProductDomainExceptions.DoesNotExist();
      products.push(product);
    }

    return products;
  }
}
