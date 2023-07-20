import { ApiProperty } from '@nestjs/swagger';

export class V1CreateCategoryHttpResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  message: string;

  constructor(response: Omit<V1CreateCategoryHttpResponse, 'message'>) {
    this.id = response.id;
    this.name = response.name;
    this.description = response.description;
    this.message = 'Category created successfully';
  }
}
