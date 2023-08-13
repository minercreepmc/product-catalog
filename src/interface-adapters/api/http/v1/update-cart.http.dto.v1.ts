export class V1UpdateCartHttpRequest {
  items: {
    amount: number;
    productId: string;
    price: number;
  }[];
  userId: string;
}

export class V1UpdateCartHttpResponse {
  items: {
    id: string;
    amount: number;
    cartId: string;
    productId: string;
    price: number;
  }[];
  userId: string;
  message: string;
  constructor(options: Omit<V1UpdateCartHttpResponse, 'message'>) {
    this.items = options.items;
    this.userId = options.userId;
    this.message = 'Cart updated successfully';
  }
}
