import { CategoryQuery } from '../category.query';

export class GetCategoryQuery extends CategoryQuery {
  populate_products?: boolean;
}
