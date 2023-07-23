export class V1CreateDiscountHttpResponse {
  name: string;
  description?: string;
  percentage: number;
  message: string;

  constructor(options: Omit<V1CreateDiscountHttpResponse, 'message'>) {
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.message = 'Discount created successfully.';
  }
}
