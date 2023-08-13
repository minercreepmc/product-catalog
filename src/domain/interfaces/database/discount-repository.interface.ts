import { DiscountAggregate } from '@aggregates/discount';
import { RepositoryPort } from '@domain-interfaces';
import { DiscountNameValueObject } from '@value-objects/discount';

export const discountRepositoryDiToken = Symbol('DISCOUNT_REPOSITORY');

export interface DiscountRepositoryPort
  extends RepositoryPort<DiscountAggregate> {
  findOneByName(
    name: DiscountNameValueObject,
  ): Promise<DiscountAggregate | null>;
}
