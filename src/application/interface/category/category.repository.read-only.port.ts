import { ReadOnlyRepositoryPort } from '@base/use-cases';
import {
  CategorySchema,
  CategorySchemaWithProducts,
} from '@database/repositories/pg/category';

export const readonlyCategoryRepositoryDiToken = Symbol(
  'READ_ONLY_CATEGORY_REPOSITORY',
);

export interface ReadOnlyCategoryRepositoryPort
  extends ReadOnlyRepositoryPort<CategorySchema> {
  findOneByName(name: string): Promise<CategorySchema | null>;
  findOneWithProducts(id: string): Promise<CategorySchemaWithProducts | null>;
}
