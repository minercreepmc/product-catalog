import {
  ProductAggregate,
  ProductAggregateDetails,
} from '@product-domain/aggregate';
import { RepositoryPort } from 'common-base-classes';

export interface ProductRepositoryPort
  extends RepositoryPort<ProductAggregate, ProductAggregateDetails> {}

export const productRepositoryDiToken = Symbol('PRODUCT_REPOSITORY');
