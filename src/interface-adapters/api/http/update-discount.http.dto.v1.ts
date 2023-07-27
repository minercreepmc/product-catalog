import { ApiProperty } from '@nestjs/swagger';

export class V1UpdateDiscountHttpRequest {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  percentage?: number;
  @ApiProperty()
  active?: boolean;
}

export class V1UpdateDiscountHttpResponse {
  id: string;
  name?: string;
  description?: string;
  percentage?: number;
  active?: boolean;
  message?: string;

  constructor(options: Omit<V1UpdateDiscountHttpResponse, 'message'>) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.active = options.active;
    this.message = 'Discount updated successfully';
  }
}
