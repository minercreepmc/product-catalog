import { PopulateDetails } from './query';

export class V1GetProductHttpQuery implements PopulateDetails {
  populate_details?: boolean;
}
export class V1GetProductHttpResponse {
  discount_name: string;
  discount_description?: string;
  discount_percentage: number;
  discount_active?: boolean;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  category_ids?: string[];
  id: string;
}
