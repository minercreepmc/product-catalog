import { ApiProperty } from '@nestjs/swagger';

export class V1RemoveCategoriesHttpRequest {
  @ApiProperty()
  ids: string[];
}
