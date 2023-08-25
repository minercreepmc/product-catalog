import { ReadOnlyRepositoryPort } from '@base/use-cases';
import { OrderSchema } from '@database/repositories/pg/order';

export const readonlyOrderRepositoryDiToken = Symbol(
  'READ_ONLY_ORDER_REPOSITORY',
);

export interface ReadOnlyOrderRepositoryPort
  extends ReadOnlyRepositoryPort<OrderSchema> {}
