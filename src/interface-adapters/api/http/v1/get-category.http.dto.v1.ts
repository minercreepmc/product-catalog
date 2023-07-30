import { V1CategoryModel } from './models';
import { PopulateProducts } from './query';

export class V1GetCategoryHttpQuery implements PopulateProducts {
  populate_products?: boolean;
}
export class V1GetCategoryHttpResponse extends V1CategoryModel {}
