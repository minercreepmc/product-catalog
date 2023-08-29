import { ReadOnlyRepositoryPort } from '@base/use-cases';
import { PaginationParams } from '@base/use-cases/query-handler';
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
  findByCategoryId(id: string): Promise<ProductSchema[]>;
  findByIdWithDetails(id: string): Promise<ProductWithDetailsSchema>;
  findSortByBestSelling(params: PaginationParams): Promise<ProductSchema[]>;
}
