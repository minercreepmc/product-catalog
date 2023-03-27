import {
  ProductAggregate,
  ProductAggregateDetails,
} from '@product-domain/aggregate';
import { ProductNameValueObject } from '@product-domain/value-objects';
import { RepositoryPort } from 'common-base-classes';

export interface ProductRepositoryPort
  extends RepositoryPort<ProductAggregate, ProductAggregateDetails> {
  findOneByName(name: ProductNameValueObject): Promise<ProductAggregate>;
}

export const productRepositoryDiToken = Symbol('PRODUCT_REPOSITORY');
