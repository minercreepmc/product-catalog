import { ProductAggregate, ProductAggregateDetails } from '@aggregates/product';
import { ProductNameValueObject } from '@value-objects/product';
import { RepositoryPort } from 'common-base-classes';

export interface ProductRepositoryPort
  extends RepositoryPort<ProductAggregate, ProductAggregateDetails> {
  findOneByName(name: ProductNameValueObject): Promise<ProductAggregate>;
}

export const productRepositoryDiToken = Symbol('PRODUCT_REPOSITORY');
