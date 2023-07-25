import { CategoryAggregate } from '@aggregates/category';
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
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  categoryRepositoryDiToken,
  CategoryRepositoryPort,
  discountRepositoryDiToken,
  DiscountRepositoryPort,
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryIdValueObject } from '@value-objects/category';
import { DiscountIdValueObject } from '@value-objects/discount';
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
    @Inject(discountRepositoryDiToken)
    private readonly discountRepository: DiscountRepositoryPort,
    @Inject(categoryRepositoryDiToken)
    private readonly categoryRepository: CategoryRepositoryPort,
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
    const { categoryIds, name, discountId } = options;

    await this.findProductByNameOrThrowIfExist(name);
    if (categoryIds) await this.findCategoriesOrThrow(categoryIds);
    if (discountId) await this.findDiscountOrThrow(discountId);

    const product = new ProductAggregate();
    const productCreatedEvent = product.createProduct(options);
    await this.productRepository.create(product);
    return productCreatedEvent;
  }

  async updateProduct(
    options: UpdateProductDomainServiceOptions,
  ): Promise<ProductUpdatedDomainEvent> {
    const { id: productId, payload } = options;
    const { discountId, categoryIds } = payload;

    const product = await this.findProductByIdOrThrow(productId);
    if (discountId) await this.findDiscountOrThrow(discountId);
    if (categoryIds) await this.findCategoriesOrThrow(categoryIds);

    const productUpdatedEvent = product.updateProduct(payload);
    await this.productRepository.updateOneById(productId, product);
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

  private async findProductByNameOrThrowIfExist(name: ProductNameValueObject) {
    const product = await this.productRepository.findOneByName(name);
    if (product) throw new ProductDomainExceptions.AlreadyExist();
    return product;
  }

  private async findProductByIdOrThrow(id: ProductIdValueObject) {
    const product = await this.productRepository.findOneById(id);
    if (!product) throw new ProductDomainExceptions.DoesNotExist();
    return product;
  }

  private async findDiscountOrThrow(id: DiscountIdValueObject) {
    const discount = await this.discountRepository.findOneById(id);
    if (!discount) throw new DiscountDomainExceptions.DoesNotExist();
    return discount;
  }

  private async findCategoriesOrThrow(ids: CategoryIdValueObject[]) {
    const categories: CategoryAggregate[] = [];
    for (const id of ids) {
      const category = await this.categoryRepository.findOneById(id);
      if (!category) throw new CategoryDomainExceptions.DoesNotExist();
      categories.push(category);
    }
    return categories;
  }
}
