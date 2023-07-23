import { ApiProperty } from '@nestjs/swagger';

export class V1RemoveDiscountsHttpRequest {
  @ApiProperty()
  ids: string[];
}
