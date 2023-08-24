export class V1UpdateCartHttpRequest {
  items: {
    amount: number;
    productId: string;
    price: number;
    cartId: string;
  }[];
}

export class V1UpdateCartHttpResponse {
  id: string;
  userId: string;
  totalPrice: number;
  items: {
    product: {
      id: string;
      price: number;
      name: string;
    };
    amount: number;
    cartId: string;
  }[];
  message: string;
  constructor(options: Omit<V1UpdateCartHttpResponse, 'message'>) {
    this.items = options.items;
    this.id = options.id;
    this.userId = options.userId;
    this.totalPrice = options.totalPrice;
    this.message = 'Cart updated successfully';
  }
}
