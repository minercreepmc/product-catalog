import { DiscountSchema } from '@database/repositories/pg/discount';

export class V1GetDiscountsHttpQuery {
  limit?: number;
  offset?: number;
}

export class V1GetDiscountsHttpResponse {
  discounts: DiscountSchema[] | null;
}
