export class V1CreateOrderHttpRequest {
  cartId: string;
  address: string;
}

export class V1CreateOrderHttpResponse {
  userId: string;
  cartId: string;
  address: string;
  id: string;
  constructor(options: V1CreateOrderHttpResponse) {
    this.id = options.id;
    this.userId = options.userId;
    this.cartId = options.cartId;
    this.address = options.address;
  }
}
