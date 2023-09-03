import { ApiProperty } from '@nestjs/swagger';

export class V1CreateDiscountHttpRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  percentage: number;
}

export class V1CreateDiscountHttpResponse {
  id: string;
  name: string;
  description?: string;
  percentage: number;
  active: boolean;
  message?: string;

  constructor(options: Omit<V1CreateDiscountHttpResponse, 'message'>) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.active = options.active;
    this.message = 'Discount created successfully.';
  }
}
