import { ApiProperty } from '@nestjs/swagger';

export class V1RemoveProductsHttpResponse {
  @ApiProperty()
  ids: string[];
  @ApiProperty()
  message: string;

  constructor(options: Omit<V1RemoveProductsHttpResponse, 'message'>) {
    this.ids = options.ids;
    this.message = 'Products removed successfully';
  }
}
