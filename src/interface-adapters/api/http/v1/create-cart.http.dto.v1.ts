export class V1CreateCartHttpRequest {}

export class V1CreateCartHttpResponse {
  id: string;
  userId: string;
  message?: string;

  constructor(response: Omit<V1CreateCartHttpResponse, 'message'>) {
    this.id = response.id;
    this.userId = response.userId;
    this.message = 'Cart created successfully.';
  }
}
