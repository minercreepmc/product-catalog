import { CategoryModel } from './models';
import { PaginationParams } from './query';

export class V1GetCategoriesHttpQuery extends PaginationParams {}
export class V1GetCategoriesHttpResponse {
  categories: CategoryModel[];
}
