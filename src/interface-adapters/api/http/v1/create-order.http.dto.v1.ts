export class V1CreateOrderHttpRequest {
  cartId: string;
  address: string;
}

export class V1CreateOrderHttpResponse {
  userId: string;
  cartId: string;
  address: string;
  constructor(options: V1CreateOrderHttpResponse) {
    this.userId = options.userId;
    this.cartId = options.cartId;
    this.address = options.address;
  }
}
