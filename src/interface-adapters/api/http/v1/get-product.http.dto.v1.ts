import { PopulateDetails } from './query';

export class V1GetProductHttpQuery implements PopulateDetails {
  populate_details?: boolean;
}
export class V1GetProductHttpResponse {
  discount?: {
    id: string;
    name: string;
    description?: string;
    percentage: number;
    active?: boolean;
  };
  categories?: {
    id: string;
    name: string;
    description?: string;
  }[];
  sold: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  discount_id?: string;
  category_ids?: string[];
  id: string;
}
