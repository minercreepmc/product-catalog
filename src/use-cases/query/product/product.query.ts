import { QueryBase } from '@base/use-cases/query-handler';
import { ProductMikroOrmModel } from '@database/repositories/mikroorm/product';

export class ProductQuery extends QueryBase<ProductMikroOrmModel> {}
