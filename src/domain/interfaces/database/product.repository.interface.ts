import { ProductAggregate } from '@aggregates/product';
import { ProductNameValueObject } from '@value-objects/product';
import { RepositoryPort } from '@domain-interfaces';

export interface ProductRepositoryPort
  extends RepositoryPort<ProductAggregate> {
  findOneByName(name: ProductNameValueObject): Promise<ProductAggregate | null>;
}

export const productRepositoryDiToken = Symbol('PRODUCT_REPOSITORY');
