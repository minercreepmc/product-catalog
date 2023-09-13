export class V1UpdateCartHttpRequest {
  items: {
    amount: number;
    productId: string;
    price: number;
    cartId: string;
    discount: number;
    name: string;
    imageUrl?: string;
  }[];
}

export class V1UpdateCartHttpResponse {
  id: string;
  userId: string;
  totalPrice: number;
  items: {
    productId: string;
    name: string;
    price: number;
    amount: number;
    cartId: string;
    discount?: number;
    totalPrice: number;
    imageUrl?: string;
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
