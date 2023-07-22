import { ReadOnlyRepositoryPort } from '@base/use-cases';
import { ProductSchema } from '@database/repositories/pg/product';

export const readOnlyProductRepositoryDiToken = Symbol(
  'READ_ONLY_PRODUCT_REPOSITORY',
);

export interface ReadonlyProductRepositoryPort
  extends ReadOnlyRepositoryPort<ProductSchema> {
  findOneByName(name: string): Promise<ProductSchema>;
}
