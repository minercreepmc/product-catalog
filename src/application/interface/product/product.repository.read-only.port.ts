import { ReadOnlyRepositoryPort } from '@base/use-cases';
import {
  ProductSchema,
  ProductWithDetailsSchema,
} from '@database/repositories/pg/product';

export const readOnlyProductRepositoryDiToken = Symbol(
  'READ_ONLY_PRODUCT_REPOSITORY',
);

export interface ReadonlyProductRepositoryPort
  extends ReadOnlyRepositoryPort<ProductSchema> {
  findOneByName(name: string): Promise<ProductSchema>;
  findByDiscountId(id: string): Promise<ProductSchema[]>;
  findByIdWithDiscount(id: string): Promise<ProductWithDetailsSchema>;
  findByIdWithDetails(id: string): Promise<ProductWithDetailsSchema>;
}
