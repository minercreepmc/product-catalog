import { ApiProperty } from '@nestjs/swagger';

export class V1RemoveProductsHttpRequest {
  @ApiProperty()
  ids: string[];
}
