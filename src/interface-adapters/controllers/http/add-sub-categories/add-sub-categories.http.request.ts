import { ApiProperty } from '@nestjs/swagger';

export class AddSubCategoriesHttpRequest {
  @ApiProperty()
  subCategoryIds: string[];
}
