import { ApiProperty } from '@nestjs/swagger';

export class V1RemoveDiscountsHttpRequest {
  @ApiProperty()
  ids: string[];
}
export class V1RemoveDiscountsHttpResponse {
  ids: string[];
  message?: string;

  constructor(options: Omit<V1RemoveDiscountsHttpResponse, 'message'>) {
    this.ids = options.ids;
    this.message = 'Discounts removed successfully.';
  }
}