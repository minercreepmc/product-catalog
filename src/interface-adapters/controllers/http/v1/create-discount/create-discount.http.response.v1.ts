export class V1CreateDiscountHttpResponse {
  name: string;
  message: string;

  constructor(options: Omit<V1CreateDiscountHttpResponse, 'message'>) {
    this.name = options.name;
    this.message = 'Discount created successfully.';
  }
}
