export class V1CreateOrderHttpRequest {
  address: string;
  totalPrice: number;
}

export class V1CreateOrderHttpResponse {
  userId: string;
  totalPrice: number;
  address: string;
  id: string;
  constructor(options: V1CreateOrderHttpResponse) {
    this.id = options.id;
    this.userId = options.userId;
    this.address = options.address;
    this.totalPrice = options.totalPrice;
  }
}
