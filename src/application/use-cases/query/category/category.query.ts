import { QueryBase } from '@base/use-cases/query-handler';
import { CategoryMikroOrmModel } from '@database/repositories/mikroorm/category';

export class CategoryQuery extends QueryBase<CategoryMikroOrmModel> {}
