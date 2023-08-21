import { ReadOnlyRepositoryPort } from '@base/use-cases';
import { CartDetailsSchema, CartSchema } from '@database/repositories/pg/cart';

export const readOnlyCartRepositoryDiToken = Symbol(
  'READ_ONLY_CART_REPOSITORY',
);

export interface ReadonlyCartRepositoryPort
  extends ReadOnlyRepositoryPort<CartSchema> {
  findOneWithItems(userId: string): Promise<CartDetailsSchema>;
}
