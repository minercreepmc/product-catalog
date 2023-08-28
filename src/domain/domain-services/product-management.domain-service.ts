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
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { unitOfWorkDiToken, UnitOfWorkPort } from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ProductVerificationDomainService } from './product-verification.domain-service';

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
    private readonly productVerificationService: ProductVerificationDomainService,
  ) {}

  async createProduct(
    options: CreateProductAggregateOptions,
  ): Promise<ProductCreatedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
      await this.productVerificationService.findProductAndThrowIfExist(
        options.name,
      );
      const product = new ProductAggregate();
      const productCreatedEvent = product.createProduct(options);
      await this.productRepository.create(product);

      return productCreatedEvent;
    });
  }

  async updateProduct(
    options: UpdateProductDomainServiceOptions,
  ): Promise<ProductUpdatedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
      const { id, payload } = options;
      const product = await this.productVerificationService.findProductOrThrow(
        id,
      );
      const productUpdatedEvent = product.updateProduct(payload);
      // find categories and discount
      await this.productRepository.updateOneById(id, product);
      return productUpdatedEvent;
    });
  }

  async removeProduct(
    id: ProductIdValueObject,
  ): Promise<ProductRemovedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
      const product = await this.productVerificationService.findProductOrThrow(
        id,
      );
      const productRemoved = product.removeProduct();
      await this.productRepository.deleteOneById(id);
      return productRemoved;
    });
  }

  async removeProducts(
    ids: ProductIdValueObject[],
  ): Promise<ProductRemovedDomainEvent[]> {
    return this.unitOfWork.runInTransaction(async () => {
      const products =
        await this.productVerificationService.findProductsOrThrow(ids);
      const productsRemovedEvent = products.map((product) =>
        product.removeProduct(),
      );
      await this.productRepository.deleteManyByIds(ids);

      return productsRemovedEvent;
    });
  }

  async increaseSold(
    id: ProductIdValueObject,
  ): Promise<ProductUpdatedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
      const product = await this.productVerificationService.findProductOrThrow(
        id,
      );
      const productUpdated = product.increaseSold();
      await this.productRepository.updateOneById(id, product);
      return productUpdated;
    });
  }
}
