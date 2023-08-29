import { ReadOnlyRepositoryPort } from '@base/use-cases';
import { DiscountSchema } from '@database/repositories/pg/discount';

export const readOnlyDiscountRepositoryDiToken = Symbol(
  'READ_ONLY_DISCOUNT_REPOSITORY',
);

export interface ReadOnlyDiscountRepositoryPort
  extends ReadOnlyRepositoryPort<DiscountSchema> {}
