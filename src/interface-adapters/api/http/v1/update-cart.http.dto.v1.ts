export class V1UpdateCartHttpRequest {
  items: {
    amount: number;
    productId: string;
    price: number;
  }[];
}

export class V1UpdateCartHttpResponse {
  items: {
    amount: number;
    price: number;
    name: string;
  }[];
  message: string;
  constructor(options: Omit<V1UpdateCartHttpResponse, 'message'>) {
    this.items = options.items;
    this.message = 'Cart updated successfully';
  }
}
