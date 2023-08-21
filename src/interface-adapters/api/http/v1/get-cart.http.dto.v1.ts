import {
  CartItemSchema,
  CartItemDetailsSchema,
} from '@database/repositories/pg/cart';

export class V1GetCartHttpQuery {
  userId: string;
  offset?: number | undefined;
  limit?: number | undefined;
}

export class V1GetCartHttpResponse {
  items: Partial<CartItemSchema | CartItemDetailsSchema>[];
  user_id: string;
  item_ids: string[];
  id: string;
}
